import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get('/list')
    async getList() {
      return await this.userService.getList();
    }
}
