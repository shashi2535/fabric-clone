import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import { isRegionPrams } from 'src/interface/user';
import { justNumber } from 'src/utility';
import { CreatePodDto, UpdatePodDto } from 'src/validation/pod.dto';
@Injectable()
export class PodService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async addPodData(req: Request, res: Response, createPodDto: CreatePodDto) {
    try {
      const {
        name,
        region_id,
        dc_id,
        Switch_number,
        pod_code,
        device_name,
        device_type,
        label_name,
        location,
        vendor,
        hosted_on,
        ce_vlan_range,
        throughput,
      } = createPodDto;

      // get a number
      const get_thought_bandwidth = justNumber(throughput);

      const dataCenterData = await this.knex
        .table('datacenter')
        .where({ id: dc_id })
        .first();
      const regionData = await this.knex
        .table('datacenter')
        .where({ id: region_id })
        .first();

      if (!dataCenterData) {
        return res.json({ message: 'Datacenter Not Found.' });
      }
      if (!regionData) {
        return res.json({ message: 'Region Not Found.' });
      }
      // eslint-disable-next-line no-else-return
      const addPodData = await this.knex
        .table('pod')
        .insert({
          name,
          region_id,
          dc_id,
          pod_code,
          Switch_number,
        })
        .returning('*');
      const addDeviceData = await this.knex
        .table('device')
        .insert({
          device_name,
          device_type,
          vendor,
          hosted_on,
          ce_vlan_range,
          pod_id: addPodData[0].id,
          throughput_total_bandwidth: get_thought_bandwidth * 1000,
          throughput_available_bandwidth: get_thought_bandwidth * 1000,
          label_name,
          location,
        })
        .returning('*');
      if (!addPodData) {
        return res.json({ message: HttpMessage.POD_NOT_ADDED });
      }

      await this.knex('pod')
        .where({ id: addPodData[0].id })
        .update({ device_id: addDeviceData[0].id });
      return res.json({
        message: HttpMessage.POD_ADDED,
        result: addPodData,
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

  async getPodData(req: Request, res: Response) {
    try {
      const getPod = await this.knex('pod')
        .select([
          'pod.name',
          'region.*',
          'pod_code',
          'Switch_number',
          'device.*',
          'dc_id',
          'datacenter.*',
        ])
        .innerJoin('region', 'pod.region_id', 'region.id')
        .join('device', 'pod.device_id', 'device.id')
        .join('datacenter', 'pod.dc_id', 'datacenter.id');
      return res.json({
        statusCode: HttpStatus.OK,
        message: HttpMessage.GET_ALL_POD_DATA,
        result: getPod,
      });
    } catch (err) {
      console.log('***************8', err);

      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
  updatePodData = async (
    req: Request,
    res: Response,
    updateDto: UpdatePodDto,
  ) => {
    try {
      const {
        name,
        region_id,
        dc_id,
        Switch_number,
        pod_code,
        device_name,
        device_type,
        label_name,
        location,
        vendor,
        hosted_on,
        ce_vlan_range,
        throughput,
      } = updateDto;

      const podObj = {
        name,
        region_id,
        dc_id,
        pod_code,
        Switch_number,
      };
      const deviceObj = {
        device_name,
        device_type,
        vendor,
        location,
        label_name,
        throughput_total_bandwidth: throughput,
        hosted_on,
        ce_vlan_range,
      };
      const result = await this.knex('pod')
        .where({ id: req.params.id })
        .update(podObj)
        .returning('*')
        .first();

      if (!result) {
        return res.json({ message: HttpMessage.POD_NOT_FOUND });
      }
      if (result) {
        await this.knex('device')
          .where({ id: result._id })
          .update(deviceObj)
          .returning('*')
          .first();
        return res.json({
          message: HttpMessage.POD_UPDATED_SUCCESSUFULLY,
          data: result,
        });
      }
    } catch (err) {
      console.log('***************8', err);

      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  };
  deletePodData = async (
    req: Request,
    res: Response,
    params: isRegionPrams,
  ) => {
    const { id } = params;
    try {
      const deletebyid = await this.knex('pod')
        .where({ id: id })
        .delete()
        .returning('*');
      if (deletebyid.length === 0) {
        return res.json({ message: HttpMessage.POD_NOT_FOUND });
      }
      if (deletebyid) {
        await this.knex('device')
          .where({ pod_id: deletebyid[0]?.id })
          .delete()
          .returning('*');
        return res.json({
          message: HttpMessage.POD_DELETED,
          data: deletebyid[0],
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  };
}
