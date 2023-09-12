import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ModifyRequest } from 'src/interface/user';
import { ConnectionService } from './connection.service';
import { Response } from 'express';
import { CreateConnection } from 'src/validation/connection.dto';
@Controller('/api/v1')
export class ConnectionController {
  constructor(private readonly connectionController: ConnectionService) {}
  @Post('/connection')
  async createConnection(
    @Req() req: ModifyRequest,
    @Res() res: Response,
    @Body() createConnectionDto: CreateConnection,
  ) {
    return this.connectionController.createConnection(
      req,
      res,
      createConnectionDto,
    );
  }
}
