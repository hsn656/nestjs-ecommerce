import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Repository } from 'typeorm';
import { User } from 'src/api/user/user.entity';

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
    await app.init();
  });

  afterEach(async () => {
    userRepository.delete({});
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
      expect(response.body.message).toBe('user already exist');
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
      expect(response.body.message).toBe('wrong data provided');
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
      expect(response.body.message).toBe('wrong data provided');
    });
  });
});