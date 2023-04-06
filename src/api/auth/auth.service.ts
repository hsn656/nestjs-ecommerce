import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { errorMessages } from 'src/shared/errors';
import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { PayloadDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: CreateUserDto) {
    const { email, password } = user;
    const alreadyExistingUser = await this.userService.findByEmail(email);
    if (!alreadyExistingUser)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials.en);

    const isValidPassword = await this.userService.comparePassword(
      password,
      alreadyExistingUser.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials.en);

    return this.generateToken({
      id: alreadyExistingUser.id,
      email,
    });
  }

  async register(user: CreateUserDto) {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser)
      throw new ConflictException(errorMessages.auth.userAlreadyExist.en);

    await this.userService.createUser(user);
    return {
      message: 'success',
    };
  }

  async generateToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });

    return { accessToken };
  }
}
