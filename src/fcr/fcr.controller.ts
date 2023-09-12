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
import { Response } from 'express';
import { isRegionPrams, ModifyRequest } from 'src/interface/user';
import { CreateFcrDto } from 'src/validation/fcrValidation';
import { FcrService } from './fcr.service';

@Controller('/api/v1')
export class FcrController {
  constructor(private readonly fcrService: FcrService) {}
  @Post('/fcr')
  async addFcrData(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Body() createFcrDto: CreateFcrDto,
  ) {
    return this.fcrService.addFcrData(req, res, createFcrDto);
  }
  @Get('/fcr')
  async getFcrData(@Req() req: ModifyRequest, @Res() res: Response) {
    return this.fcrService.getFcrData(req, res);
  }
  @Get('/fcr/:id')
  async getFcrById(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.fcrService.getFcrById(req, res, params);
  }
  @Get('/active/fcr/')
  async activeInactiveFcrCount(
    @Req() req: ModifyRequest,
    @Res() res: Response,
  ) {
    return this.fcrService.fcrActiveInactiveCount(req, res);
  }

  @Get('/log/fcr/:id')
  async fcrLogById(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.fcrService.getLogByFcrID(req, res, params);
  }

  @Put('/fcr/:id')
  async updateFcrData(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.fcrService.updateFcrData(req, res, params);
  }

  @Delete('/fcr/:id')
  async deleFcrData(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.fcrService.deleteFcrById(req, res, params);
  }
}
