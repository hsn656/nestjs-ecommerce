import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async assignRoleToUser(roleId: number, user: User) {
    const role = await this.findById(roleId);

    await role.users.push(user);
    await this.rolesRepository.save(role);
  }

  async findById(roleId: number) {
    return this.rolesRepository.findOne({
      where: {
        id: roleId,
      },
    });
  }
}
