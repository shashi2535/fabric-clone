import { Get, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import { CreateMintermDto } from 'src/validation/minTerm.dto';
@Injectable()
export class MintermService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async addMinterm(
    req: Request,
    res: Response,
    createmintermDto: CreateMintermDto,
  ) {
    try {
      const addMinTerm = await this.knex
        .table('min_term')
        .insert({
          term_number: createmintermDto.term_number.trim(),
          term_name: createmintermDto.term_name.trim(),
        })
        .returning('*');
      if (addMinTerm[0]) {
        return res.json({
          message: HttpMessage.MINTERM_ADDED,
          result: addMinTerm[0],
        });
      }
      if (!addMinTerm[0]) {
        return res.json({ message: HttpMessage.MINTERM_NOT_ADDED });
      }
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
  @Get()
  async getMinTerm(req: Request, res: Response) {
    try {
      const findTerm = await this.knex('min_term').where({});
      if (!findTerm) {
        return res.send({ message: HttpMessage.MINTERM_NOT_FOUND });
      }
      if (findTerm.length > 0) {
        return res.send({
          message: HttpMessage.GET_MINTERM_LIST,
          result: findTerm,
        });
      }
      return res.send({
        statusCode: HttpStatus.NOT_FOUND,
        message: HttpMessage.NOT_FOUND,
        result: findTerm,
      });
    } catch (err) {
      return res.send({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
