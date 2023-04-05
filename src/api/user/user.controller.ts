import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get('profile')
  profile(@Req() req: any) {
    return this.userService.findById(req.user.id);
  }
}
