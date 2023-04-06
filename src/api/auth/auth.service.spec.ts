import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { configuration } from 'src/config';
import { errorMessages } from 'src/shared/errors';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  const newUser = {
    id: 1,
    email: 'testuser@example.com',
    password: 'password',
  } as User;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
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
        errorMessages.auth.userAlreadyExist.en,
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
        errorMessages.auth.wronCredentials.en,
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
        errorMessages.auth.wronCredentials.en,
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
