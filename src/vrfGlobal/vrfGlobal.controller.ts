import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VrfService } from './vrf.service';
@Controller('/api/v1')
export class VrfGlobalController {
  constructor(private readonly vrfGlobalService: VrfService) {}
  @Post('/vrfGlobal')
  async addVrfGlobalData(@Req() req: Request, @Res() res: Response) {
    return this.vrfGlobalService.createVrfData(req, res);
  }
}
