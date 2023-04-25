import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: CreateUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}
