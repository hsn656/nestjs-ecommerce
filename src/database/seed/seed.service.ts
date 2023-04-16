import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './seeders/admin.seeder';
import { CategorySeeder } from './seeders/category.seeder';
import { RolesSeeder } from './seeders/role.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly rolesSeeder: RolesSeeder,
    private readonly adminSeeder: AdminSeeder,
    private readonly categoriesSeeder: CategorySeeder,
  ) {
    this.seeders = [this.rolesSeeder, this.adminSeeder, this.categoriesSeeder];
  }

  async seed() {
    await Bluebird.each(this.seeders, async (seeder: SeederInterface) => {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    });
  }
}
