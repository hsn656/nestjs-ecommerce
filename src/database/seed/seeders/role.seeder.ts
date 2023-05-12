import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Role } from 'src/database/entities/role.entity';
import { RoleIds, Roles } from 'src/api/role/enum/role.enum';

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
    const data: Partial<Role>[] = [];
    Object.keys(Roles).forEach((key) => {
      data.push({
        id: RoleIds[key],
        name: Roles[key],
      });
    });
    return data;
  }
}
