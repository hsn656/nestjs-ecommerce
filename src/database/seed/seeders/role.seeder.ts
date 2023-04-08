import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/api/role/role.entity';
import { SeederInterface } from '../seeder.interface';
import { RoleIds, Roles } from 'src/api/role/role.enum';

@Injectable()
export class RolesSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async seed() {
    const data: Partial<Role>[] = this.generateData();
    await this.rolesRepository.upsert(data, {
      conflictPaths: ['id'],
    });
  }

  generateData(): Partial<Role>[] {
    return [
      {
        id: RoleIds.Customer,
        name: Roles.Customer,
      },
      {
        id: RoleIds.Merchant,
        name: Roles.Merchant,
      },
      {
        id: RoleIds.Admin,
        name: Roles.Admin,
      },
    ];
  }
}
