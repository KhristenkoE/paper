import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encryptPassword } from 'utils/encryption';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';

enum ExceptionCode {
  USER_EXISTS = 'user_exists',
  INVALID_BODY = 'invalid_body',
}

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(user: RegisterDto): Promise<any> {
    try {
      if (!user.username || !user.password || !user.email) {
        throw ExceptionCode.INVALID_BODY
      }

      if (await this.userModel.findOne({ username: user.username })) {
        throw ExceptionCode.USER_EXISTS
      }

      const createdUser = await new this.userModel({
        username: user.username,
        password: encryptPassword(user.password),
        email: user.email,
      }).save({ timestamps: true });

      return {
        username: createdUser.username,
        email: createdUser.email,
        error: null,
      };
    } catch (err) {
      if (err as ExceptionCode === ExceptionCode.INVALID_BODY) {
        throw new BadRequestException('Invalid request body');
      }

      if (err as ExceptionCode === ExceptionCode.USER_EXISTS) {
        throw new BadRequestException('User already exists');
      }

      throw new InternalServerErrorException;
    }
  }
}
