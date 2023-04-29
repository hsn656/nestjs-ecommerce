import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { errorMessages } from 'src/errors/custom';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const user = {
    email: 'test1s@test.com',
    password: '12345678',
  };
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    userRepository.delete({});
    await app.init();
  });

  afterEach(async () => {
    await app.close;
  });

  describe('/auth/register (POST)', () => {
    it('should success', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      expect(response.body.isSuccess).toBe(true);
    });

    it('should fail if already registered', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);

      expect(response.body.isSuccess).toBe(false);
      expect(response.body.message).toBe(
        errorMessages.auth.userAlreadyExist.message,
      );
    });
  });

  describe('/auth/login (POST)', () => {
    it('should success', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
      expect(response.body.isSuccess).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should fail if wrong password', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...user,
          password: 'wrong password',
        });
      expect(response.body.isSuccess).toBe(false);
      expect(response.body.message).toBe(
        errorMessages.auth.wronCredentials.message,
      );
    });

    it('should fail if wrong email', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          ...user,
          email: 'wrong@test.com',
        });
      expect(response.body.isSuccess).toBe(false);
      expect(response.body.message).toBe(
        errorMessages.auth.wronCredentials.message,
      );
    });
  });
});
