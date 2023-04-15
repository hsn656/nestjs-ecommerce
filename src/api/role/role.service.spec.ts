import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleIds, Roles } from './role.enum';
import { UserService } from '../user/user.service';

describe('RoleService', () => {
  let service: RoleService;
  const customerRole = {
    id: RoleIds.Customer,
    name: Roles.Customer,
  } as Role;
  const fakeRoleRepo: Partial<Repository<Role>> = {
    findOne: () => {
      return Promise.resolve(customerRole);
    },
  };

  const fakeUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: fakeRoleRepo,
        },
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
