import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import {
  CreatePortDto,
  updatePortDto,
  UpdatePortDtoByAdminStatus,
} from 'src/validation/port.dto';
import { Response } from 'express';
import {
  isPortDisParams,
  isPortIdParams,
  isRegionPrams,
  ModifyRequest,
  PortObject,
} from 'src/interface/user';
import { addToCart } from 'src/helper/addToCart';
import { justNumber } from 'src/utility';
import ShortUniqueId from 'short-unique-id';
import { portCreateAnsible } from 'src/ansible/portAnsible';
const uid = new ShortUniqueId({ length: 10 });
@Injectable()
export class PortService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async createPort(
    req: ModifyRequest,
    res: Response,
    createPortDto: CreatePortDto,
  ) {
    try {
      const { dc_id, region_id, minTerm, portName, port_speed, status, type } =
        createPortDto;
      const getPodData: any = await this.knex('pod')
        .where({
          dc_id: dc_id,
        })
        .first()
        .returning('*');
      if (!getPodData) {
        return res.json({ message: HttpMessage.POD_NOT_AVAILABLE });
      }
      if (getPodData) {
        const portData = await this.knex('port')
          .where({
            org_code: req.org.org_code,
            portName: portName,
          })
          .first()
          .returning('*');

        if (portData) {
          return res.json({ message: HttpMessage.PORT_NAME_ALREDY_EXIST });
        }

        if (status === 'Saved') {
          await addToCart(req, res, createPortDto, this.knex);
        } else {
          const DeviceData: any = await this.knex('device')
            .where({
              pod_id: getPodData.id,
            })
            .first()
            .returning('*');
          if (DeviceData.available_sp_vlan.length === 0) {
            return res.json({
              message: HttpMessage.PORT_CREATE_LIMIT,
            });
          }
          const availablePorts = DeviceData.available_ports;
          const totalPorts = DeviceData.total_ports;
          const Switch_numbers = getPodData.Switch_number;
          const device_types = DeviceData.device_type;
          const totalSp_vlan = DeviceData.available_sp_vlan[0];
          if (
            Switch_numbers === '1' &&
            availablePorts > 0 &&
            device_types === 'pswitch'
          ) {
            const totalsAvaialblePorts = availablePorts - Number(1);
            const assignports = totalPorts - totalsAvaialblePorts;
            const findregionData: any = await this.knex('region')
              .where({
                id: region_id,
              })
              .first()
              .returning('*');
            const findDatacenterData: any = await this.knex('datacenter')
              .where({
                id: dc_id,
              })
              .first()
              .returning('*');
            const speed = port_speed.toLowerCase().includes('gbps');
            const no_ports_org_dc = await this.knex('port').where({
              dc_id: dc_id,
              org_code: req.org.org_code,
            });
            if (
              no_ports_org_dc.length + Number(1) >
              findDatacenterData.no_ports_org_dc
            ) {
              return res.json({
                message: HttpMessage.LIMIT_EXIST,
              });
            }
            const display_port_id = uid();

            const short_dis_port_id = display_port_id.slice(0, 6);
            const data = justNumber(port_speed);
            const ports: any = await this.knex('port')
              .insert({
                portName: portName,
                Assigned_port_number: assignports,
                display_port_id: display_port_id,
                user_email: req.user.email,
                user_name: req.user.name,
                org_code: req.org.org_code,
                org_name: req.org.org_name,
                sp_vlan_id: totalSp_vlan,
                admin_status: 'Provisioning',
                port_speed: port_speed,
                sp_vlan_name: short_dis_port_id,
                region_id: region_id,
                status: status,
                available_BW: speed ? `${data * 1000} MBPS` : `${data} MBPS`,
                dc_id: dc_id,
                type: type.toLowerCase(),
                pod_id: getPodData.id,
                port_code: `${findregionData.region_code}-${findDatacenterData.dc_code}-${getPodData.pod_code}`,
                minTerm: minTerm,
              })
              .returning('*');

            if (!ports) {
              return res.json({ message: HttpMessage.PORT_NOT_CREATE });
            }
            if (ports) {
              const logData = await this.knex('log')
                .insert({
                  user_email: ports[0].user_email,
                  user_name: ports[0].user_name,
                  org_code: ports[0].org_code,
                  org_name: ports[0].org_name,
                  log_type: 'port',
                  action: 'create',
                  category: 'user',
                  port_id: ports[0].id,
                  dis_id: ports[0].display_port_id,
                  speed: ports[0].port_speed,
                  name: ports[0].portName,
                })
                .returning('*');
              const updateDeviceData = await this.knex('device')
                .where({ pod_id: getPodData.id })
                .update({
                  device_name: DeviceData.device_name,
                  total_ports: DeviceData.total_ports,
                  device_type: DeviceData.device_type,
                  available_ports: totalsAvaialblePorts,
                  // colName: knex.raw('array_append(colName, ?)', ['cats'])
                  // used_sp_vlan: this.knex.raw('array_prepend(used_sp_vlan,?)', [
                  //   totalSp_vlan,
                  // ]),
                  used_sp_vlan: this.knex.raw('array_append(used_sp_vlan, ?)', [
                    totalSp_vlan,
                  ]),
                  available_sp_vlan: this.knex.raw(
                    'array_remove(available_sp_vlan, ?)',
                    [totalSp_vlan],
                  ),
                })
                .returning('*');
              await this.knex('usedPort').insert({
                device_id: updateDeviceData[0].id,
                port_id: ports[0].id,
              });

              // array_column_name: this.knex.raw(
              //   'array_append(array_column_name, ?)',
              //   [data_to_append],
              // ),

              if (!updateDeviceData) {
                return res.json({
                  message: HttpMessage.NOT_UPDATE_DEVICE,
                });
              }
              if (updateDeviceData) {
                const ansibleObj = {
                  pod_name: ports[0].port_code,
                  ha: 'no',
                  sp_vlan_id: ports[0].sp_vlan_id,
                  sp_vlan_name: ports[0].sp_vlan_name,
                };
                await portCreateAnsible(ansibleObj, ports, logData, this.knex);
                return res.json({
                  message: HttpMessage.ADMIN_STATUS_SUCCESS,
                  result: ports,
                });
              }
              // eslint-disable-next-line no-unreachable
              return;
            }
            return;
          }
          return res.json({ message: HttpMessage.POD_NOT_FOR_PORT });
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

  async getPortById(req: ModifyRequest, res: Response, params: isRegionPrams) {
    try {
      const { id } = params;
      const getPod = await this.knex('port')
        .select(['port.*', 'region.*', 'datacenter.*'])
        .join('region', 'port.region_id', 'region.id')
        .join('datacenter', 'port.dc_id', 'datacenter.id')
        .where((builder) => builder.where('port.id', id));
      return res.json({
        statusCode: HttpStatus.OK,
        message: HttpMessage.GET_ALL_POD_DATA,
        result: getPod[0],
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updatePortById(
    req: ModifyRequest,
    res: Response,
    params: isRegionPrams,
    updatePortDto: updatePortDto,
  ) {
    const { body } = req;
    try {
      // const data = req.body
      const { minterm } = updatePortDto;

      const portData: PortObject = await this.knex('port')
        .where({ id: params.id })
        .first()
        .returning('*');
      if (minterm) {
        if (Number(portData.minTerm) > Number(minterm)) {
          return res.json({
            message: HttpMessage.CHECK_MINTERM,
          });
        }
        const updateData1: PortObject = await this.knex('port')
          .where({ id: params.id })
          .update({ minTerm: minterm })
          .returning('*');

        if (!updateData1[0]) {
          return res.json({
            message: HttpMessage.NOT_FOUND,
          });
        }
        if (updateData1[0]) {
          if (updateData1.status === 'Order') {
            await this.knex('log')
              .insert({
                user_email: updateData1[0].user_email,
                user_name: updateData1[0].user_name,
                org_code: updateData1[0].org_code,
                org_name: updateData1[0].org_name,
                log_type: 'port',
                action: 'update',
                category: 'user',
                port_id: updateData1[0].id,
                dis_id: updateData1[0].display_port_id,
                speed: updateData1[0].port_speed,
                name: updateData1[0].portName,
              })
              .returning('*');

            return res.json({
              message: HttpMessage.UPDATE_ORDER_PORT,
              result: updateData1,
            });
          }
          return res.json({
            message: HttpMessage.UPDATE_SAVED_PORT,
            result: updateData1,
          });
        }
      } else {
        const updateData1: PortObject = await this.knex('port')
          .where({ id: params.id })
          .update(body)
          .returning('*');
        if (!updateData1[0]) {
          return res.json({
            message: HttpMessage.NOT_FOUND,
          });
        }
        if (updateData1[0]) {
          if (updateData1[0].status === 'Order') {
            await this.knex('log')
              .insert({
                user_email: updateData1[0].user_email,
                user_name: updateData1[0].user_name,
                org_code: updateData1[0].org_code,
                org_name: updateData1[0].org_name,
                log_type: 'port',
                action: 'update',
                category: 'user',
                port_id: updateData1[0].id,
                dis_id: updateData1[0].display_port_id,
                speed: updateData1[0].port_speed,
                name: updateData1[0].portName,
              })
              .returning('*');

            return res.json({
              message: HttpMessage.UPDATE_ORDER_PORT,
              result: updateData1,
            });
          }
          return res.json({
            message: HttpMessage.UPDATE_SAVED_PORT,
            result: updateData1,
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

  async deletePortById(
    req: ModifyRequest,
    res: Response,
    params: isRegionPrams,
  ) {
    try {
      //     // find port data
      const { id } = params;
      const portData = await this.knex('port').where({ id: id }).first();
      if (!portData) {
        return res.json({ message: 'Port Not Found' });
      }
      //     // check port is exist in connection
      // const checkConnections = await this.knex('connection')
      //   .where({
      //     a_end_port_id: id,
      //   })
      //   .orWhere({ b_end_port_id: id })
      //   .returning('*');
      // if (checkConnections) {
      //   return res.json({
      //     message: HttpMessage.PORT_USED_IN_CONN,
      //   });
      // }
      await this.knex('usedPort').where({ port_id: id }).delete();
      // delete port data
      const deletebyid: PortObject = await this.knex('port')
        .where({ id })
        .delete()
        .returning('*');
      if (!deletebyid) {
        return res.json({ message: HttpMessage.NOT_FOUND });
      }
      if (deletebyid) {
        if (deletebyid[0].status === 'Order') {
          // create a log for port
          await this.knex('log')
            .insert({
              user_email: deletebyid[0].user_email,
              user_name: deletebyid[0].user_name,
              org_code: deletebyid[0].org_code,
              org_name: deletebyid[0].org_name,
              log_type: 'port',
              action: 'delete',
              category: 'user',
              del_port_id: deletebyid[0].id,
              dis_id: deletebyid[0].display_port_id,
              speed: deletebyid[0].port_speed,
              name: deletebyid[0].portName,
            })
            .returning('*');

          // device data for the port
          const deviceData = await this.knex('device')
            .where({
              pod_id: deletebyid[0].pod_id,
            })
            .returning('*')
            .first();

          if (deviceData) {
            // update device
            const updatedSp_vlan = Number(deletebyid[0].sp_vlan_id);
            await this.knex('device')
              .where({ pod_id: deletebyid[0].pod_id })
              .update({
                available_ports: deviceData.available_ports + Number(1),
                used_sp_vlan: this.knex.raw('array_remove(used_sp_vlan, ?)', [
                  updatedSp_vlan,
                ]),
                available_sp_vlan: this.knex.raw(
                  'array_append(available_sp_vlan,?)',
                  [updatedSp_vlan],
                ),
              });
            await this.knex('usedPort').where({ port_id: id }).delete();
            return res.json({
              message: HttpMessage.DELETE_ORDER_PORT,
              result: deletebyid,
            });
          }
        } else {
          return res.json({
            message: HttpMessage.DELETE_SAVED_PORT,
            result: deletebyid,
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
    //     // call delete ansible script.
    //     // await portAnsible.portDeleteAnsible(req, res, portData);
  }

  async updatePortByAdminStatus(
    req: ModifyRequest,
    res: Response,
    params: isPortDisParams,
    UpdatePortDtoByAdminStatus: UpdatePortDtoByAdminStatus,
  ) {
    const { dis_id } = params;
    const {
      target_admin_status,
      target_operational_status,
      current_admin_status,
      current_operational_status,
    } = UpdatePortDtoByAdminStatus;
    try {
      const getport: PortObject = await this.knex('port')
        .where({
          display_port_id: dis_id,
        })
        .returning('*')
        .first();
      if (!getport) {
        return res.json({
          statusCode: HttpStatus.NOT_FOUND,
          message: HttpMessage.NOT_FOUND,
        });
      }
      if (
        getport.admin_status === current_admin_status &&
        getport.operational_state === current_operational_status
      ) {
        const updateData1 = await await this.knex('port')
          .where({
            display_port_id: dis_id,
          })
          .update({
            admin_status: target_admin_status,
            operational_state: target_operational_status,
          })
          .returning('*');
        if (!updateData1) {
          return res.json({
            message: HttpMessage.NOT_FOUND,
          });
        }
        if (updateData1) {
          return res.json({
            message: HttpMessage.ADMIN_STATUS_CHANGE,
            result: updateData1,
          });
        }
      } else {
        return res.json({
          message: HttpMessage.UPDATE_ADMIN_STATUS,
        });
      }
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLogByPortId(
    req: ModifyRequest,
    res: Response,
    params: isPortIdParams,
  ) {
    try {
      const { port_id } = params;
      const { org_code } = req.org;
      const result = await this.knex('log')
        .select(['port.*', 'log.*'])
        .join('port', 'port.id', 'log.port_id')
        .where((builder) =>
          builder.where({ port_id: port_id, 'log.org_code': org_code }),
        )
        .returning('*');
      return res.json({
        message: HttpMessage.LOG_BY_PORT_ID,
        result: result,
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

  async getActiveInctivePortCount(req: ModifyRequest, res: Response) {
    try {
      const { org_code } = req.org;
      //   // get user used Inactive Port count
      const inActivePortCount = await this.knex('port')
        .where({
          org_code: org_code,
          operational_state: 'Inactive',
        })
        .returning('*');
      //   // get user used Active Port count
      const activePortCount = await this.knex('port')
        .where({
          org_code: org_code,
          operational_state: 'Active',
        })
        .returning('*');
      return res.json({
        message: HttpMessage.GET_USED_PORT_DETAILS,
        result: {
          activePort: activePortCount.length,
          inActivePort: inActivePortCount.length,
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

  async getPortList(req: ModifyRequest, res: Response) {
    try {
      const { org_code } = req.org;
      const portData = await this.knex('port')
        .where({ org_code })
        .returning('*');
      return res.json({
        message: HttpMessage.GET_PORT_LIST,
        result: portData,
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
}
