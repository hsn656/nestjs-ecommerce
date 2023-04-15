import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Role } from 'src/api/role/role.entity';
import { SeederInterface } from '../seeder.interface';
import { User } from 'src/api/user/entities/user.entity';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSeeder implements SeederInterface {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    private readonly config: ConfigService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async seed() {
    const data: Partial<User> = await this.generateData();
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const result = await transactionalEntityManager.upsert(User, data, {
        conflictPaths: ['email'],
      });
      const adminUser = await transactionalEntityManager
        .getRepository(User)
        .findOne({
          where: {
            id: result.raw[0].id,
          },
        });
      adminUser.roles = data.roles;
      await transactionalEntityManager.save(adminUser);
    });
  }

  async generateData(): Promise<Partial<User>> {
    const hashedPassword = await hash(
      this.config.get<string>('adminUser.password'),
      10,
    );
    const adminRoles = await this.rolesRepository.find();
    return {
      email: this.config.get<string>('adminUser.email'),
      password: hashedPassword,
      roles: adminRoles,
    };
  }
}
