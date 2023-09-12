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
import { Request, Response } from 'express';
import { RegionService } from './region.service';
import { CreateRegionDto } from '../validation/region.dto';
import { isRegionPrams } from 'src/interface/user';
@Controller('/api/v1')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}
  @Post('/region')
  addRegion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createRegionDto: CreateRegionDto,
  ) {
    return this.regionService.addRegion(req, res, createRegionDto);
  }

  @Get('/region/:id')
  getRegionById(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: isRegionPrams,
  ) {
    return this.regionService.getRegionById(req, res, id);
  }

  @Get('/region')
  getRegion(@Req() req: Request, @Res() res: Response) {
    return this.regionService.getRegion(req, res);
  }

  @Delete('/region/:id')
  deleteRegionById(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: isRegionPrams,
  ) {
    return this.regionService.deleteRegionById(req, res, id);
  }

  @Put('/region/:id')
  updateRegionById(
    @Req() req: Request,
    @Res() res: Response,
    @Param() id: isRegionPrams,
  ) {
    return this.regionService.updateRegionById(req, res, id);
  }
}
