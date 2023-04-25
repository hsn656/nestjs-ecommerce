import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'src/config';
import { Category } from 'src/database/entities/category.entity';
import { Role } from 'src/database/entities/role.entity';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmConfigService } from 'src/shared/typeorm/typeorm.service';
import { SeedService } from './seed.service';
import { AdminSeeder } from './seeders/admin.seeder';
import { CategorySeeder } from './seeders/category.seeder';
import { RolesSeeder } from './seeders/role.seeder';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Role, User, Category]),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
  controllers: [],
  providers: [SeedService, RolesSeeder, AdminSeeder, CategorySeeder],
})
export class SeedModule {}
