import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleIds, Roles } from './role.enum';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: fakeRoleRepo,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
