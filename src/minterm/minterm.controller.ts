import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateMintermDto } from 'src/validation/minTerm.dto';
import { MintermService } from './minterm.service';

@Controller('/api/v1')
export class MintermController {
  constructor(private readonly mintermService: MintermService) {}
  @Post('/minterm')
  addMinterm(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createMintermDto: CreateMintermDto,
  ) {
    return this.mintermService.addMinterm(req, res, createMintermDto);
  }

  @Get('/minterm')
  getMinterm(@Req() req: Request, @Res() res: Response) {
    return this.mintermService.getMinTerm(req, res);
  }
}
