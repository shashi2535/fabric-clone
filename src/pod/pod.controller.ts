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
import { isRegionPrams } from 'src/interface/user';
import { CreatePodDto, UpdatePodDto } from 'src/validation/pod.dto';
import { PodService } from './pod.service';

@Controller('/api/v1')
export class PodController {
  constructor(private readonly podService: PodService) {}
  @Post('/pod')
  async addPod(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createPodDto: CreatePodDto,
  ) {
    return this.podService.addPodData(req, res, createPodDto);
  }

  @Get('/pod')
  async getPod(@Req() req: Request, @Res() res: Response) {
    return this.podService.getPodData(req, res);
  }

  @Put('/pod/:id')
  async updatePodData(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateDto: UpdatePodDto,
  ) {
    return this.podService.updatePodData(req, res, updateDto);
  }

  @Delete('/pod/:id')
  async deletePodData(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: isRegionPrams,
  ) {
    return this.podService.deletePodData(req, res, params);
  }
}
