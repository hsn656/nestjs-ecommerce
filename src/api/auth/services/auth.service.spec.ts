import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { configuration } from 'src/config';
import { Role } from '../../../database/entities/role.entity';
import { RoleIds, Roles } from '../../role/enum/role.enum';
import { User } from '../../../database/entities/user.entity';
import { AuthService } from './auth.service';
import { RoleService } from 'src/api/role/services/role.service';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  let fakeRoleService: Partial<RoleService>;

  const newUser = {
    id: 1,
    email: 'testuser@example.com',
    password: 'password',
  } as User;

  const customerRole = {
    id: RoleIds.Customer,
    name: Roles.Customer,
  } as Role;

  beforeEach(async () => {
    fakeUserService = {
      createUser: () => {
        return Promise.resolve(newUser);
      },
      findByEmail: () => {
        return null;
      },
      comparePassword: () => {
        return Promise.resolve(true);
      },
    };

    fakeRoleService = {
      findById: () => {
        return Promise.resolve(customerRole);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: RoleService,
          useValue: fakeRoleService,
        },
      ],
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3h' },
        }),
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test register method', () => {
    it('should success', async () => {
      const result = await service.register({
        email: 'email',
        password: 'password',
      });
      expect(result).toStrictEqual({ message: 'success' });
    });

    it('should throw error if user exists', async () => {
      fakeUserService.findByEmail = () => {
        return Promise.resolve(newUser);
      };

      const result = service.register({
        email: 'email',
        password: 'password',
      });
      expect(result).rejects.toThrowError(
        errorMessages.auth.userAlreadyExist.message,
      );
    });
  });

  describe('test login method', () => {
    it('should success', async () => {
      fakeUserService.findByEmail = () => {
        return Promise.resolve(newUser);
      };

      const result = await service.login({
        email: 'email',
        password: 'password',
      });
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw error if not registered', async () => {
      const result = service.login({
        email: 'email',
        password: 'password',
      });
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should throw error if wrong password', async () => {
      fakeUserService.comparePassword = () => {
        return Promise.resolve(false);
      };
      const result = service.login({
        email: 'email',
        password: 'password',
      });
      expect(result).rejects.toThrowError(
        errorMessages.auth.wronCredentials.message,
      );
    });
  });

  describe('test generate token method', () => {
    it('should success', async () => {
      const result = await service.generateToken({
        email: 'email',
        id: 1,
      });
      expect(result).toHaveProperty('accessToken');
    });
  });
});
