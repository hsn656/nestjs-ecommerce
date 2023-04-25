import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../database/entities/role.entity';
import { UserModule } from '../user/user.module';
import { User } from '../../database/entities/user.entity';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), UserModule],
  controllers: [RoleController],
  providers: [RoleService, UserService],
  exports: [RoleService],
})
export class RoleModule {}
