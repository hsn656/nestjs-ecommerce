import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/api/role/role.entity';
import { configuration } from 'src/config';
import { TypeOrmConfigService } from 'src/shared/typeorm/typeorm.service';
import { SeedService } from './seed.service';
import { RolesSeeder } from './seeders/role.seeder';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([Role]),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
  controllers: [],
  providers: [SeedService, RolesSeeder],
})
export class SeedModule {}
