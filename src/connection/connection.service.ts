import { HttpStatus, Injectable, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { ModifyRequest } from 'src/interface/user';
import { Request, Response } from 'express';
import { HttpMessage } from 'src/constrant';
import { CreateConnection } from 'src/validation/connection.dto';

@Injectable()
export class ConnectionService {
  constructor(@InjectModel() readonly Knex: Knex) {}
  @Post()
  async createConnection(
    req: ModifyRequest,
    res: Response,
    createConnectionDto: CreateConnection,
  ) {
    try {
      console.log('<<<<<');

      return 'hello';
    } catch (err) {
      return res.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
