import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/guards/auth.guard';
import { Roles } from 'src/api/auth/guards/roles.decorator';
import { RolesGuard } from 'src/api/auth/guards/roles.guard';
import { AssignRoleDto } from '../dto/role.dto';
import { RoleIds } from '../enum/role.enum';
import { RoleService } from '../services/role.service';

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
