import { Body, Controller, Post, Req, Session } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  async register(@Session() session: Record<string, any>, @Body() body: RegisterDto) {
    return await this.appService.register(body, session);
  }
}
