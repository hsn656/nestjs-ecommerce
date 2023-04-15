import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './role.dto';
import { UserService } from '../user/user.service';
import { errorMessages } from 'src/shared/errors';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly userService: UserService,
  ) {}

  async assignRoleToUser(data: AssignRoleDto) {
    const role = await this.findById(data.roleId);
    const user = await this.userService.findById(data.userId, { roles: true });
    if (!user.roles.some((userRole) => userRole.id === data.roleId)) {
      user.roles.push(role);
    }
    await this.userService.update(user);
  }

  async findById(roleId: number) {
    const role = await this.rolesRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new NotFoundException(errorMessages.role.notFound.en);
    }
    return role;
  }
}
