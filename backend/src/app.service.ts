import { BadRequestException, HttpCode, HttpStatus, Injectable, InternalServerErrorException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Session } from 'express-session';
import { Model } from 'mongoose';
import { encryptPassword } from 'utils/encryption';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';

export enum ExceptionCode {
  USER_EXISTS = 'user_exists',
  INVALID_BODY = 'invalid_body',
}

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(user: RegisterDto, session: Record<string, any>): Promise<any> {
    try {
      console.log(session.id, 'id');
      if (!user.username || !user.password || !user.email) {
        console.log(session.id, 'id');
        throw ExceptionCode.INVALID_BODY
      }

      if (await this.userModel.findOne({ username: user.username })) {
        console.log(session.id, 'id');
        throw ExceptionCode.USER_EXISTS
      }

      const createdUser = await new this.userModel({
        username: user.username,
        password: encryptPassword(user.password),
        email: user.email,
      }).save({ timestamps: true });

      session.isAuthenticated = true;

      return {
        username: createdUser.username,
        email: createdUser.email,
        error: null,
      };
    } catch (err) {
      switch (err as ExceptionCode) {
        case ExceptionCode.USER_EXISTS:
          throw new BadRequestException({
            message: 'User already exists',
            status: ExceptionCode.USER_EXISTS,
            code: HttpStatus.BAD_REQUEST,
          });
        case ExceptionCode.INVALID_BODY:
          throw new BadRequestException({
            message: 'Invalid request body',
            status: ExceptionCode.INVALID_BODY,
            code: HttpStatus.BAD_REQUEST,
          });
        default:
          throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
