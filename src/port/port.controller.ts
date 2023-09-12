import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { PortService } from './port.service';
import { Response } from 'express';
import {
  CreatePortDto,
  updatePortDto,
  UpdatePortDtoByAdminStatus,
} from 'src/validation/port.dto';
import {
  isPortDisParams,
  isPortIdParams,
  isRegionPrams,
  ModifyRequest,
} from 'src/interface/user';

@Controller('/api/v1')
export class PortController {
  constructor(private readonly portService: PortService) {}
  @Post('/port')
  async addPort(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Body() createPortdto: CreatePortDto,
  ) {
    return this.portService.createPort(req, res, createPortdto);
  }

  @Get('/port/:id')
  async getPortById(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.portService.getPortById(req, res, params);
  }
  @Get('/port')
  async getPort(@Req() req: ModifyRequest, @Res() res: Response) {
    return this.portService.getPortList(req, res);
  }

  @Put('/port/:id')
  async updatePortById(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
    @Body() updatePrtDto: updatePortDto,
  ) {
    return this.portService.updatePortById(req, res, params, updatePrtDto);
  }

  @Delete('/port/:id')
  async deletePortById(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.portService.deletePortById(req, res, params);
  }

  @Put('/adminStatus/port/:dis_id')
  async updateAdminStatus(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isPortDisParams,
    @Body() updatePortDtoByAdminStatus: UpdatePortDtoByAdminStatus,
  ) {
    return this.portService.updatePortByAdminStatus(
      req,
      res,
      params,
      updatePortDtoByAdminStatus,
    );
  }

  @Get('/active_list/port')
  async getActiveInactiveListInPort(
    @Req() req: ModifyRequest,
    @Res() res: Response,
  ) {
    return this.portService.getActiveInctivePortCount(req, res);
  }

  @Get('/log/port/:port_id')
  async getLogByPortId(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isPortIdParams,
  ) {
    return this.portService.getLogByPortId(req, res, params);
  }
}
