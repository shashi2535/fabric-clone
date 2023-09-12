import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { Response } from 'express';
import { isRegionPrams, ModifyRequest } from 'src/interface/user';
import { HttpMessage } from 'src/constrant';
import ShortUniqueId from 'short-unique-id';
import { justNumber } from 'src/utility';
import { CreateFcrDto } from 'src/validation/fcrValidation';
@Injectable()
export class FcrService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async addFcrData(
    req: ModifyRequest,
    res: Response,
    createFcrDto: CreateFcrDto,
  ) {
    try {
      // body distructuring
      const {
        name,
        term,
        asn,
        router_id,
        bgp_state,
        dc_id,
        region_id,
        type,
        speed,
      } = createFcrDto;
      // check name already exist
      const frcData = await this.knex('fcr')
        .where({
          org_code: req.org.org_code,
          fcrName: name,
        })
        .returning('*')
        .first();
      if (frcData) {
        return res.json({ message: HttpMessage.FCR_EXIST });
      }
      // Get Device and POD_code from POD
      const podData = await this.knex('pod')
        .where({
          dc_id,
        })
        .returning('*')
        .first();
      if (!podData) {
        return res.json({ message: HttpMessage.POD_NOT_AVAILABLE });
      }
      // check fcr with same organation.
      const findDatacenterData = await this.knex('datacenter')
        .where({
          id: dc_id,
        })
        .returning('*')
        .first();
      if (!findDatacenterData) {
        return res.json({ message: HttpMessage.DATACENTER_NOT_EXIST });
      }
      // Get device details
      const deviceData = await this.knex('device')
        .where({
          id: podData.device_id,
        })
        .returning('*')
        .first();
      // Get Pod_Code
      const { pod_code } = podData;
      // Get Region Code
      const regionData = await this.knex('region')
        .where({
          id: region_id,
        })
        .returning('*')
        .first();
      if (!regionData) {
        return res.json({ message: HttpMessage.REGION_NOT_EXIST });
      }

      const no_fcrs_org_dc = await this.knex('fcr')
        .where({
          dc_id: dc_id,
          org_code: req.org.org_code,
        })
        .returning('*');
      const no_fcr_org_dc_count = no_fcrs_org_dc.length + Number(1);
      if (no_fcr_org_dc_count > findDatacenterData.no_fcr_org_dc) {
        return res.json({
          message: HttpMessage.LIMIT_EXIST,
        });
      }
      const { region_code } = regionData;
      const { dc_code } = findDatacenterData;
      // create fcr_code
      const fcr_code = `${region_code}-${dc_code}-${pod_code}`;

      // get vrf details
      const vrfData = await this.knex('vrfGlobal')
        .where('l3vrf_available_list', '!=', '{}')
        .returning('*')
        .first()
        .orderBy('vrf_number', 'asc');

      const { vrf_number, l3vrf_available_list } = vrfData;
      // generate UUID length 8
      const uid = new ShortUniqueId({ length: 8 });

      // convert to number
      const getSpeedNumber = justNumber(speed);
      // check speed in gbps
      const updatedSpeed = speed.toLowerCase().includes('gbps');
      // create FCR
      const l3_org_detailData = await this.knex('l3OrgDetails')
        .where({
          org_code: req.org.org_code,
        })
        .returning('*')
        .first();
      if (l3_org_detailData) {
        const fcr: any = await this.knex('fcr')
          .insert({
            fcrName: name,
            term,
            asn,
            router_id,
            bgp_state,
            type: type.toLowerCase(),
            user_email: req.user.email,
            user_name: req.user.name,
            org_code: req.org.org_code,
            org_name: req.org.org_name,
            vrf_number: l3_org_detailData.vrf_number,
            dc_id,
            region_id,
            l3vrf_table_number: l3_org_detailData.l3_vrf_number,
            admin_status: 'Provisioning',
            oper_status: 'Active',
            pod_id: podData.id,
            speed: updatedSpeed
              ? `${getSpeedNumber * 1000} MBPS`
              : `${getSpeedNumber} MBPS`,
            available_BW: updatedSpeed
              ? `${getSpeedNumber * 1000} MBPS`
              : `${getSpeedNumber} MBPS`,
            display_fcr_id: uid(),
            fcr_code,
          })
          .returning('*');
        if (fcr[0]) {
          const updateDeviceData = await this.knex('device')
            .where({ pod_id: podData.id })
            .update({
              available_fcr: deviceData.available_fcr - Number(1),
            })
            .returning('*');
          await this.knex('usedFcr').insert({
            device_id: updateDeviceData[0].id,
            fcr_id: fcr[0].id,
          });
          await this.knex('log')
            .insert({
              user_email: fcr[0].user_email,
              user_name: fcr[0].user_name,
              org_code: fcr[0].org_code,
              org_name: fcr[0].org_name,
              action: 'create',
              category: 'user',
              log_type: 'fcr',
              dis_id: fcr[0].display_fcr_id,
              fcr_id: fcr[0].id,
              name: fcr[0].name,
              speed: fcr[0].speed,
            })
            .returning('*');
          //   // eslint-disable-next-line no-unreachable
          const populateFcrData = await this.knex('fcr')
            .select('region.*', 'datacenter.*', 'fcr.*')
            .leftJoin('datacenter', 'fcr.dc_id', 'datacenter.id')
            .leftJoin('region', 'fcr.region_id', 'region.id')
            .where((builder) => builder.where('fcr.id', fcr[0].id));
          return res.json({
            message: HttpMessage.FCR_CREATED,
            result: populateFcrData,
          });
        }
      } else {
        const fcr: any = await this.knex('fcr')
          .insert({
            fcrName: name,
            term,
            asn,
            router_id,
            bgp_state,
            type: type.toLowerCase(),
            user_email: req.user.email,
            user_name: req.user.name,
            org_code: req.org.org_code,
            org_name: req.org.org_name,
            // vrf_number: l3_org_detailData.vrf_number,
            dc_id,
            region_id,
            // l3vrf_table_number: l3_org_detailData.l3_vrf_number,
            admin_status: 'Provisioning',
            oper_status: 'Active',
            pod_id: podData.id,
            speed: updatedSpeed
              ? `${getSpeedNumber * 1000} MBPS`
              : `${getSpeedNumber} MBPS`,
            available_BW: updatedSpeed
              ? `${getSpeedNumber * 1000} MBPS`
              : `${getSpeedNumber} MBPS`,
            display_fcr_id: uid(),
            fcr_code,
          })
          .returning('*');
        if (fcr) {
          await this.knex('log').insert({
            user_email: fcr[0].user_email,
            user_name: fcr[0].user_name,
            org_code: fcr[0].org_code,
            org_name: fcr[0].org_name,
            action: 'create',
            category: 'user',
            log_type: 'fcr',
            dis_id: fcr[0].display_fcr_id,
            fcr_id: fcr[0].id,
            name: fcr[0].name,
            speed: fcr[0].speed,
          });
          const updateDeviceData = await this.knex('device')
            .where({ pod_id: podData.id })
            .update({
              available_fcr: deviceData.available_fcr - Number(1),
            })
            .returning('*');
          await this.knex('usedFcr').insert({
            device_id: updateDeviceData[0].id,
            fcr_id: fcr[0].id,
          });

          await this.knex('vrfGlobal')
            .where({ id: vrfData.id })
            .update({
              l3vrf_available_list: this.knex.raw(
                'array_remove(l3vrf_available_list, ?)',
                [l3vrf_available_list[0]],
              ),
              l3vrf_used_list: this.knex.raw(
                'array_append(l3vrf_used_list, ?)',
                [l3vrf_available_list[0]],
              ),
              // available_fcr: deviceData.available_fcr - Number(1),
            })
            .returning('*');
          //     // update fcr
          //     // eslint-disable-next-line prefer-destructuring

          const createL3_org_table = await this.knex('l3OrgDetails')
            .insert({
              org_name: fcr[0].org_name,
              org_code: fcr[0].org_code,
              vrf_number: vrf_number,
              l3_vrf_number: l3vrf_available_list[0],
            })
            .returning('*');

          await this.knex('fcr').where({ id: fcr[0].id }).update({
            l3vrf_table_number: createL3_org_table[0].l3_vrf_number,
            vrf_number: createL3_org_table[0].vrf_number,
          });

          //     // Ansible Object
          //     const ansibleObj = {
          //       podname: fcr.fcr_code,
          //       ha: 'no',
          //       fcr_id: fcr.display_fcr_id.slice(0, 6),
          //       router_id_prefix: fcr.router_id,
          //       asn: fcr.asn,
          //       vrf_number: fcr.vrf_number,
          //       l3vrf_table: fcr.l3vrf_table_number,
          //       bgp_state: fcr.bgp_state.toLowerCase(),
          //     };
          //     // call a function  Ansible script
          //     // await fcrAnsible.fcrCreateAnsible(ansibleObj, fcr, logData);
          //     // eslint-disable-next-line no-unreachable
          const populateFcrData = await this.knex('fcr')
            .select('datacenter.*', 'region.*', 'fcr.*')
            .join('datacenter', 'datacenter.id', 'fcr.dc_id')
            .join('region', 'region.id', 'fcr.region_id')
            .where((builder) => builder.where({ 'fcr.id': fcr[0].id }))
            .returning('*');

          return res.json({
            message: HttpMessage.FCR_CREATED,
            result: populateFcrData,
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFcrData(req: ModifyRequest, res: Response) {
    try {
      const { org_code } = req.org;
      const findData = await this.knex('fcr')
        .select(['region.*', 'datacenter.*', 'fcr.*'])
        .where({ org_code: org_code })
        .join('datacenter', 'datacenter.id', 'fcr.dc_id')
        .join('region', 'region.id', 'fcr.region_id')
        .returning('*');
      return res.json({
        statusCode: HttpStatus.OK,
        message: HttpMessage.GET_FCR_LIST,
        data: findData,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.OK,
        message: err.message,
      });
    }
  }

  async updateFcrData(
    req: ModifyRequest,
    res: Response,
    params: isRegionPrams,
  ) {
    try {
      const { id } = params;
      const updateFcrData = await this.knex('fcr')
        .where({ id: id })
        .update({
          fcrName: req.body.name,
        })
        .returning('*');
      if (!updateFcrData[0]) {
        return res.json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: HttpMessage.FCR_NOT_FOUND,
        });
      }
      await this.knex('log')
        .insert({
          user_email: updateFcrData[0].user_email,
          user_name: updateFcrData[0].user_name,
          org_code: updateFcrData[0].org_code,
          org_name: updateFcrData[0].org_name,
          action: 'update',
          category: 'user',
          log_type: 'fcr',
          dis_id: updateFcrData[0].display_fcr_id,
          fcr_id: updateFcrData[0].id,
          name: updateFcrData[0].name,
          speed: updateFcrData[0].speed,
        })
        .returning('*');
      return res.json({
        statusCode: HttpStatus.OK,
        message: HttpMessage.FCR_UPDATED,
        data: updateFcrData[0],
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.OK,
        message: err.message,
      });
    }
  }
  async fcrActiveInactiveCount(req: ModifyRequest, res: Response) {
    try {
      const { org_code } = req.org;
      // get user used Inactive fcr count
      const inActiveFcrCount = await this.knex('fcr')
        .where({
          org_code: org_code,
          oper_status: 'Inactive',
        })
        .returning('*');
      // get user used Active fcr count
      const activeFcrCount = await this.knex('fcr').where({
        org_code: org_code,
        oper_status: 'Active',
      });
      return res.json({
        message: HttpMessage.GET_USED_FCR_DETAILS,
        result: {
          activeFcr: activeFcrCount.length,
          inActiveFcr: inActiveFcrCount.length,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFcrById(req: ModifyRequest, res: Response, pramas: isRegionPrams) {
    try {
      const { id } = pramas;
      const getFcrData = await this.knex('fcr')
        .select('datacenter.*', 'region.*', 'fcr.*')
        .join('datacenter', 'datacenter.id', 'fcr.dc_id')
        .join('region', 'region.id', 'fcr.region_id')
        .where((builder) => builder.where('fcr.id', id))
        .returning('*')
        .first();

      if (!getFcrData) {
        return res.json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: HttpMessage.FCR_NOT_FOUND,
        });
      }

      return res.json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: HttpMessage.GET_FCR_LIST,
        result: getFcrData,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLogByFcrID(
    req: ModifyRequest,
    res: Response,
    params: isRegionPrams,
  ) {
    try {
      const { id } = params;
      const { org_code } = req.org;
      const getLogData = await this.knex('log')
        .where({
          fcr_id: id,
          org_code: org_code,
        })
        .first()
        .returning('*');
      console.log('****', getLogData);

      return res.json({
        message: HttpMessage.LOG_BY_FCR_ID,
        statusCode: HttpStatus.OK,
        data: getLogData,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteFcrById(
    req: ModifyRequest,
    res: Response,
    pramas: isRegionPrams,
  ) {
    try {
      const { id } = pramas;
      const checkFcrData = await this.knex('fcr')
        .where({
          id: id,
        })
        .returning('*')
        .first();
      if (!checkFcrData) {
        return res.json({ message: HttpMessage.FCR_NOT_FOUND });
      }
      const vrfData = await this.knex('vrfGlobal')
        .where({ vrf_number: checkFcrData.vrf_number })
        .returning('*')
        .first();

      const deviceData = await this.knex('device')
        .where({ pod_id: checkFcrData.pod_id })
        .returning('*')
        .first();
      if (!deviceData) {
        return res.json({
          message: HttpMessage.POD_NOT_AVAILABLE,
        });
      }
      const deleteFcrData: any = await this.knex('fcr')
        .where({
          id: id,
        })
        .delete()
        .returning('*');
      await this.knex('device')
        .where({ pod_id: checkFcrData.pod_id })
        .update({
          available_fcr: deviceData.available_fcr + Number(1),
        })
        .returning('*');
      await this.knex('usedFcr').where({ fcr_id: checkFcrData.id }).delete();
      await this.knex('log').insert({
        user_email: checkFcrData.user_email,
        user_name: checkFcrData.user_name,
        org_code: checkFcrData.org_code,
        org_name: checkFcrData.org_name,
        action: 'delete',
        category: 'user',
        log_type: 'fcr',
        dis_id: checkFcrData.display_fcr_id,
        del_fcr_id: deleteFcrData[0].id,
        name: checkFcrData.name,
        speed: checkFcrData.speed,
      });
      const fcrAllData = await this.knex('fcr')
        .where({
          org_code: deleteFcrData[0].org_code,
        })
        .returning('*');
      if (fcrAllData.length < 1) {
        // delete from vrfGlobal

        await this.knex('vrfGlobal')
          .where({ id: vrfData.id })
          .update({
            l3vrf_available_list: this.knex.raw(
              'array_append(l3vrf_available_list, ?)',
              [deleteFcrData[0].l3vrf_table_number],
            ),
            l3vrf_used_list: this.knex.raw('array_remove(l3vrf_used_list, ?)', [
              deleteFcrData[0].l3vrf_table_number,
            ]),
            // available_fcr: deviceData.available_fcr - Number(1),
          })
          .returning('*');
        // delete from l3orgdetail
        await this.knex('l3OrgDetails')
          .where({
            org_code: deleteFcrData[0].org_code,
          })
          .delete();
      }
      return res.json({
        statusCode: HttpStatus.OK,
        message: HttpMessage.FCR_DELETED,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
