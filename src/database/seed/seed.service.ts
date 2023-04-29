import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { SeederInterface } from './seeder.interface';
import { AdminSeeder } from './seeders/admin.seeder';
import { CategorySeeder } from './seeders/category.seeder';
import { ColorSeeder } from './seeders/color.seeder';
import { CountrySeeder } from './seeders/country.seeder';
import { CurrencySeeder } from './seeders/currency.seeder';
import { RolesSeeder } from './seeders/role.seeder';
import { SizeSeeder } from './seeders/size.seeder';

@Injectable()
export class SeedService {
  private readonly seeders: SeederInterface[] = [];
  private readonly logger = new Logger(SeedService.name);

  constructor(
    rolesSeeder: RolesSeeder,
    adminSeeder: AdminSeeder,
    categoriesSeeder: CategorySeeder,
    sizesSeeder: SizeSeeder,
    colorsSeeder: ColorSeeder,
    countrySeeder: CountrySeeder,
    currencySeeder: CurrencySeeder,
  ) {
    this.seeders = [
      rolesSeeder,
      adminSeeder,
      categoriesSeeder,
      sizesSeeder,
      colorsSeeder,
      countrySeeder,
      currencySeeder,
    ];
  }

  async seed() {
    await Bluebird.each(this.seeders, async (seeder: SeederInterface) => {
      this.logger.log(`Seeding ${seeder.constructor.name}`);
      await seeder.seed();
    });
  }
}
