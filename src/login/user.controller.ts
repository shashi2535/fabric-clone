import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../validation/user.dto';
import { Request, Response } from 'express';
@Controller('/api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/login')
  login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.login(req, res, createUserDto);
  }
}
