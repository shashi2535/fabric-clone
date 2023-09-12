import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import { isRegionPrams } from 'src/interface/user';
import { CreateRegionDto } from '../validation/region.dto';
@Injectable()
export class RegionService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async addRegion(
    req: Request,
    res: Response,
    createRegionDto: CreateRegionDto,
  ) {
    try {
      const addRegion = await this.knex
        .table('region')
        .insert(createRegionDto)
        .returning('*');
      if (!addRegion) {
        return res.json({ message: HttpMessage.REGION_NOT_CREATED });
      }
      return res.json({
        message: HttpMessage.REGION_CREATED,
        result: addRegion[0],
      });
    } catch (err) {
      // logger.error(`${err}:something went wrong`)
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getRegionById(req: Request, res: Response, params: isRegionPrams) {
    try {
      const getRegionId = await this.knex
        .table('region')
        .where({ id: params.id })
        .first();
      if (!getRegionId) {
        return res.json({ message: HttpMessage.REGION_NOT_FOUND });
      }
      return res.json({
        message: HttpMessage.GET_REGION_BY_ID,
        result: getRegionId,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getRegion(req: Request, res: Response) {
    try {
      const getRegionId = await this.knex.table('region').returning('*');
      if (!getRegionId) {
        return res.json({ message: HttpMessage.REGION_NOT_FOUND });
      }
      return res.json({
        message: HttpMessage.GET_REGION_BY_ID,
        result: getRegionId,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteRegionById(req: Request, res: Response, params: isRegionPrams) {
    try {
      const getRegionId = await this.knex
        .table('region')
        .where({ id: params.id })
        .returning('*')
        .first();
      if (!getRegionId) {
        return res.json({ message: HttpMessage.REGION_NOT_FOUND });
      }
      const deleteRegionData = await this.knex
        .table('region')
        .where({ id: params.id })
        .del();
      console.log('<<<<', deleteRegionData);
      return res.json({
        message: HttpMessage.GET_REGION_BY_ID,
        result: getRegionId,
      });
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRegionById(req: Request, res: Response, params: isRegionPrams) {
    try {
      const getRegionId = await this.knex
        .table('region')
        .where({ id: params.id })
        .returning('*')
        .first();
      if (!getRegionId) {
        return res.json({ message: HttpMessage.REGION_NOT_FOUND });
      }
      const updateRegionData = await this.knex
        .table('region')
        .where({ id: params.id })
        .update({ region_code: req.body.region_code })
        .returning('*');
      return res.json({
        message: HttpMessage.GET_REGION_BY_ID,
        result: updateRegionData[0],
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
