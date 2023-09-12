import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { Knex } from 'knex';
import { ModifyRequest } from 'src/interface/user';
import { InjectModel } from 'nest-knexjs';
import { HttpMessage } from 'src/constrant';
import { Ispayload, IsEmailpayload } from '../interface/user';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private jwt: JwtService,
  ) {}
  async use(req: ModifyRequest, res: Response, next: NextFunction) {
    try {
      const { accesstoken } = req.headers;
      let emails;
      try {
        const payload: any = this.jwt.decode(`${accesstoken}`, {
          complete: true,
        });
        const { email } = payload.payload;
        emails = email;
      } catch (err) {
        return res.json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: HttpMessage.UNAUTHORIZED,
        });
      }
      const userData = await this.knex
        .table('user')
        .where({ email: emails })
        .first()
        .innerJoin('org', 'user.id', 'org.id');
      if (!userData) {
        return res.json({
          statusCode: HttpStatus.NOT_FOUND,
          message: HttpMessage.LOING_REQUEST,
        });
      }
      const user = {
        name: userData.name,
        email: userData.email,
        id: userData.id,
      };
      const org = {
        org_id: userData.org_id,
        org_name: userData.org_name,
        org_code: userData.org_code,
      };
      req.org = org;
      req.user = user;
      next();
    } catch (err) {
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
