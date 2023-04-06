import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { errorMessages } from 'src/shared/errors';

describe('UserService', () => {
  let service: UserService;
  const fakeUserRepo: Partial<Repository<User>> = {
    findOne: () => {
      return Promise.resolve(user);
    },
  };
  const user = {
    id: 1,
    email: 'test@test.com',
  } as User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUserRepo,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get user by Id', () => {
    it('should success', async () => {
      const result = await service.findById(1);
      expect(result.id).toBe(user.id);
    });

    it('should throw error if not found', async () => {
      fakeUserRepo.findOne = () => {
        return Promise.resolve(null);
      };
      const result = service.findById(1);
      expect(result).rejects.toThrowError(errorMessages.user.notFound.en);
    });
  });
});
