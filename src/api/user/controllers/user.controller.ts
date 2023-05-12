import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PayloadDto } from 'src/api/auth/dto/auth.dto';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { User } from 'src/api/auth/guards/user.decorator';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Serialize(UserDto)
  @Get('profile')
  profile(@User() user: PayloadDto) {
    return this.userService.findById(user.id);
  }
}
