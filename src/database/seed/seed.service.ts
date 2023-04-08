import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { Connection } from 'typeorm';
import { SeederInterface } from './seeder.interface';
import { RolesSeeder } from './seeders/role.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly connection: Connection,
    private readonly rolesSeeder: RolesSeeder,
  ) {
    this.seeders = [this.rolesSeeder];
  }

  async seed() {
    await Bluebird.each(this.seeders, async (seeder: SeederInterface) => {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    });
  }
}
