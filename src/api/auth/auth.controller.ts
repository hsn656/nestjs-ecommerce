import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: CreateUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.register(user);
  }
}
