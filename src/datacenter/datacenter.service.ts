import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import {
  CreateDatacenter,
  UpdateDatacenter,
} from 'src/validation/datacenter.dto';
import { isRegionPrams } from '../interface/user';
@Injectable()
export class DataceterService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async addDatacenter(
    req: Request,
    res: Response,
    createmdatacenterDto: CreateDatacenter,
  ) {
    try {
      const regionData = await this.knex
        .table('region')
        .where({ id: createmdatacenterDto.region_id })
        .first();
      if (!regionData) {
        return res.json({
          message: 'Region Not Found.',
        });
      }
      const addDatacenter = await this.knex
        .table('datacenter')
        .insert({
          dc_code: createmdatacenterDto.dc_code.trim(),
          name: createmdatacenterDto.name.trim(),
          portSpeed: createmdatacenterDto.portSpeed.trim(),
          country: createmdatacenterDto.country.trim(),
          city: createmdatacenterDto.city.trim(),
          address: createmdatacenterDto.address.trim(),
          latitude: createmdatacenterDto.latitude.trim(),
          longitude: createmdatacenterDto.longitude.trim(),
          stage: createmdatacenterDto.stage.trim(),
          region_id: createmdatacenterDto.region_id,
          role: createmdatacenterDto.role.trim(),
          minterm_id: createmdatacenterDto.min_term,
        })
        .returning('*');
      if (addDatacenter[0]) {
        // const datacenterData = await this.knex
        //   .table('datacenter')
        //   .join('region', 'datacenter.region_id', 'region.id')
        //   .where({ id: Number(addDatacenter[0].id) })
        //   // .join('min_term', 'datacenter.minterm_id', 'min_term.id')
        //   .first();
        // console.log('<<<<', datacenterData);

        return res.json({
          message: HttpMessage.MINTERM_ADDED,
          result: addDatacenter[0],
        });
      }
      if (!addDatacenter[0]) {
        return res.json({ message: HttpMessage.MINTERM_NOT_ADDED });
      }
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async getDatacenter(req: Request, res: Response) {
    try {
      const findDataCenter = await this.knex('datacenter')
        .join('region', 'datacenter.region_id', 'region.id')
        .join('min_term', 'datacenter.minterm_id', 'min_term.id')
        .select([
          'datacenter.*',
          'region.region_name',
          'region.region_code',
          'min_term.term_name',
          'min_term.term_number',
        ]);
      if (!findDataCenter) {
        return res.send({ message: HttpMessage.MINTERM_NOT_FOUND });
      }
      if (findDataCenter.length > 0) {
        return res.send({
          message: HttpMessage.GET_DATACENTER,
          result: findDataCenter,
        });
      }
      return res.send({
        statusCode: HttpStatus.NOT_FOUND,
        message: HttpMessage.NOT_FOUND,
        result: findDataCenter,
      });
    } catch (err) {
      return res.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async updateDatacenterData(
    req: Request,
    res: Response,
    params: isRegionPrams,
    updataDatacenterBody: UpdateDatacenter,
  ) {
    try {
      const { id } = params;
      const updateData = await this.knex
        .table('datacenter')
        .where({ id: id })
        .first()
        .update(updataDatacenterBody)
        .returning('*');
      if (!updateData) {
        return res.json({ message: HttpMessage.DATACENTER_NOT_FOUND });
      }
      if (updateData) {
        return res.json({
          message: HttpMessage.DATACENTER_UPDATED,
          result: updateData,
        });
      }
    } catch (err) {
      return res.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteDataCenter(req: Request, res: Response, params: isRegionPrams) {
    try {
      const { id } = params;
      const deleteData = await this.knex
        .table('datacenter')
        .where({ id: id })
        .first()
        .delete()
        .returning('*');

      if (!deleteData) {
        return res.json({ message: HttpMessage.DATACENTER_NOT_FOUND });
      }
      if (deleteData) {
        return res.json({
          message: HttpMessage.DATACENTER_UPDATED,
          result: deleteData,
        });
      }
    } catch (err) {
      return res.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
