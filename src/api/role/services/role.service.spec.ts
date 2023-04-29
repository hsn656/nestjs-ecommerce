import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../../database/entities/role.entity';
import { RoleService } from './role.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleIds, Roles } from '../enum/role.enum';
import { User } from '../../../database/entities/user.entity';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';

describe('RoleService', () => {
  let service: RoleService;
  const customerRole = {
    id: RoleIds.Customer,
    name: Roles.Customer,
  } as Role;
  let user;
  let fakeRoleRepo: Partial<Repository<Role>>;

  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    user = {
      id: 1,
      email: 'test@test.com',
      password: '123456678',
      roles: [
        {
          id: RoleIds.Customer,
          name: Roles.Customer,
        },
      ],
    } as User;
    fakeRoleRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(customerRole)),
    };
    fakeUserService = {
      findById: jest.fn().mockImplementation(() => Promise.resolve(user)),
      save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    };
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

  describe('findById: get role by Id', () => {
    it('should success', async () => {
      const result = await service.findById(customerRole.id);

      expect(fakeRoleRepo.findOne).toBeCalled();
      expect(result.id).toBe(customerRole.id);
    });

    it('should throw error if not found', async () => {
      fakeRoleRepo.findOne = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));
      const result = service.findById(1);

      expect(fakeRoleRepo.findOne).toBeCalled();
      expect(result).rejects.toThrowError(errorMessages.role.notFound.message);
    });
  });

  describe('assignRoleToUser: assing role to user', () => {
    it('should assign', async () => {
      const result = await service.assignRoleToUser({
        roleId: RoleIds.Merchant,
        userId: user.id,
      });

      expect(fakeRoleRepo.findOne).toBeCalled();
      expect(fakeUserService.findById).toBeCalled();

      expect(result.roles.length).toBe(2);
    });

    it('should not assign', async () => {
      const result = await service.assignRoleToUser({
        roleId: RoleIds.Customer,
        userId: user.id,
      });

      expect(fakeRoleRepo.findOne).toBeCalled();
      expect(fakeUserService.findById).toBeCalled();

      expect(result.roles.length).toBe(1);
    });
  });
});
