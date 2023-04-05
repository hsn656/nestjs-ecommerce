import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { User } from 'src/api/user/user.entity';
import { generateMockToken } from 'test/mocks/jwt';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const user = {
    email: 'testy@test.com',
    password: 'password',
  };
  let currentUser: User;
  let userRepository: Repository<User>;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    userRepository.delete({});
    currentUser = await userRepository.create(user);
    currentUser = await userRepository.save(currentUser);
    token = await generateMockToken(moduleFixture, currentUser);
    await app.init();
  });

  afterEach(async () => {
    await app.close;
  });

  describe('/user/profile (GET)', () => {
    it('should success', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(user);
      expect(response.body.isSuccess).toBe(true);
    });
  });
});
