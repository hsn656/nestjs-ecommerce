import { Test, TestingModule } from '@nestjs/testing';
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
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
      expect(result).toStrictEqual(newUser);
    });

    it('should success', async () => {
      fakeUserService.findByEmail = () => {
        return Promise.resolve(newUser);
      };

      const result = service.register({
        email: 'email',
        password: 'password',
      });
      expect(result).rejects.toThrowError('user already exist');
    });
  });
});
