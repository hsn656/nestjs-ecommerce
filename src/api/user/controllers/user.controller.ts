import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, ProtectedRequest } from 'src/api/auth/guards/auth.guard';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get('profile')
  profile(@Req() req: ProtectedRequest) {
    return this.userService.findById(req.user.id);
  }
}
