import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AssignRoleDto } from './role.dto';
import { RoleIds } from './role.enum';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles(RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('assign')
  async assignRoleToUser(@Body() body: AssignRoleDto) {
    return this.roleService.assignRoleToUser(body);
  }
}
