import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../database/entities/user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { errorMessages } from 'src/errors/custom';

describe('UserService', () => {
  let service: UserService;
  let fakeUserRepo: Partial<Repository<User>>;
  const user = {
    id: 1,
    email: 'test@test.com',
    password: '123456678',
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeUserRepo = {
      findOne: jest.fn().mockImplementation(() => Promise.resolve(user)),
      save: jest.fn().mockImplementation(() => Promise.resolve(user)),
      create: jest.fn().mockImplementation(() => Promise.resolve(user)),
    };
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

  describe('findById: get user by Id', () => {
    it('should success', async () => {
      const result = await service.findById(1);

      expect(fakeUserRepo.findOne).toBeCalled();
      expect(result.id).toBe(user.id);
    });

    it('should throw error if not found', async () => {
      fakeUserRepo.findOne = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));
      const result = service.findById(1);

      expect(fakeUserRepo.findOne).toBeCalled();
      expect(result).rejects.toThrowError(errorMessages.user.notFound.message);
    });
  });

  describe('findByEmail: get user by email', () => {
    it('should success', async () => {
      const result = await service.findByEmail('test@test.com');
      expect(fakeUserRepo.findOne).toBeCalled();
      expect(result.id).toBe(user.id);
    });

    it('will be null', async () => {
      fakeUserRepo.findOne = jest
        .fn()
        .mockImplementation(() => Promise.resolve(null));
      const result = await service.findByEmail('notFound@test.com');

      expect(fakeUserRepo.findOne).toBeCalled();
      expect(result).toBe(null);
    });
  });

  describe('save: save with userRepository', () => {
    it('should success', async () => {
      const result = await service.save(user);
      expect(fakeUserRepo.save).toBeCalled();
      expect(result.id).toBe(user.id);
    });
  });

  describe('create: create user', () => {
    it('should success', async () => {
      const result = await service.createUser(user);
      expect(fakeUserRepo.create).toBeCalled();
      expect(fakeUserRepo.save).toBeCalled();
      expect(result.id).toBe(user.id);
    });
  });
});
