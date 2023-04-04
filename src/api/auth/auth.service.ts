import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

    return this.generateToken({ id: alreadyExistingUser.id, email });
  }

  async register(user: CreateUserDto): Promise<User> {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser) throw new ConflictException('user already exist');

    const newUser = this.userService.createUser(user);
    return newUser;
  }

  async generateToken(payload: PayloadDto) {
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
