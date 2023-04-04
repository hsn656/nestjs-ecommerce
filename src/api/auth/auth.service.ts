import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
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
      throw new UnauthorizedException('wrong data provided');

    const isValidPassword = await this.userService.comparePassword(
      password,
      alreadyExistingUser.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('wrong data provided');

    return this.generateToken({
      id: alreadyExistingUser.id,
      email,
    });
  }

  async register(user: CreateUserDto) {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser) throw new ConflictException('user already exist');

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
