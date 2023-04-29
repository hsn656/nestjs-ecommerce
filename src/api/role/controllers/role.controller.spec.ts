import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from 'src/config';
import { TypeOrmConfigService } from 'src/database/typeorm/typeorm.service';
import { AuthModule } from '../../auth/auth.module';
import { RoleController } from './role.controller';
import { Role } from '../../../database/entities/role.entity';
import { RoleIds, Roles } from '../enum/role.enum';
import { RoleService } from '../services/role.service';
import { UserService } from 'src/api/user/services/user.service';

describe('RoleController', () => {
  let controller: RoleController;
  let fakeRoleService: Partial<RoleService>;
  let fakeUserService: Partial<UserService>;

  const customerRole = {
    id: RoleIds.Customer,
    name: Roles.Customer,
  } as Role;

  beforeEach(async () => {
    fakeRoleService = {
      findById: () => {
        return Promise.resolve(customerRole);
      },
    };
    fakeUserService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: fakeRoleService,
        },
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
      imports: [
        AuthModule,
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
