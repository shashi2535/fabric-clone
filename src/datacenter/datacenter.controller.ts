import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateDatacenter } from 'src/validation/datacenter.dto';
import { DataceterService } from './datacenter.service';
import { isRegionPrams } from '../interface/user';
import { UpdateDatacenter } from '../validation/datacenter.dto';
@Controller('/api/v1')
export class DatacenterController {
  constructor(private readonly datacenterService: DataceterService) {}
  @Post('/datacenter')
  addDatacenter(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createdatacenterDto: CreateDatacenter,
  ) {
    return this.datacenterService.addDatacenter(req, res, createdatacenterDto);
  }

  @Get('/datacenter')
  getDataCenter(@Req() req: Request, @Res() res: Response) {
    return this.datacenterService.getDatacenter(req, res);
  }

  @Put('/datacenter/:id')
  updateDatacenter(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: isRegionPrams,
    @Body() updateDatacenterDto: UpdateDatacenter,
  ) {
    return this.datacenterService.updateDatacenterData(
      req,
      res,
      params,
      updateDatacenterDto,
    );
  }
  //   @Get('/minterm')
  //   getMinterm(@Req() req: Request, @Res() res: Response) {
  //     return this.mintermService.getMinTerm(req, res);
  //   }
}
