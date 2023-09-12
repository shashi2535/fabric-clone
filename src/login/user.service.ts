import { HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateUserDto } from '../validation/user.dto';
import { Request, Response } from 'express';
import { HttpMessage } from 'src/constrant';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private jwt: JwtService,
  ) {}
  async login(req: Request, res: Response, createUserDto: CreateUserDto) {
    try {
      const { accessToken, org_code, org_name } = createUserDto;
      let decoded;
      try {
        decoded = await this.jwt.decode(accessToken, { complete: true });
      } catch (err) {
        return res.json({
          statusCode: HttpStatus.UNAUTHORIZED,
          errors: err.message,
          message: HttpMessage.UNAUTHORIZED,
        });
      }
      const { email, name } = decoded.payload;
      const userData = await this.knex
        .table('user')
        .where({
          email,
        })
        .first();
      if (!userData) {
        const user = await this.knex
          .table('user')
          .insert({ email, name })
          .returning('id');
        const orgData = await this.knex
          .table('org')
          .insert({
            org_name: org_name,
            org_code: org_code,
            user_id: user[0].id,
          })
          .returning('id');
        await this.knex.table('user').update({ org_id: orgData[0].id }).where({
          id: user[0].id,
        });

        if (user) {
          return res.json({ message: 'user login', data: user });
        }
        return res.json({ message: 'unable to create user' });
      }
      return res.json({ message: 'already exist', result: userData });
    } catch (err) {
      console.log(err);

      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err.message,
        message: HttpMessage.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
