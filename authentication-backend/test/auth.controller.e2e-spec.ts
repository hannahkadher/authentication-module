import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/services/auth.service';
import { LocalAuthGuard } from '../src/auth/guard/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    login: () => ({ accessToken: 'testToken' }),
    signUp: () => ({ id: 'testId' }),
    refresh: () => ({ newToken: 'newTestToken' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { username: 'test' }; // Mock user object
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test', password: 'test' })
      .expect(201)
      .expect(authService.login());
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'test', password: 'test', email: 'test@test.com' })
      .expect(201)
      .expect(authService.signUp());
  });

  it('/auth/refresh (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ token: 'oldTestToken' })
      .expect(authService.refresh());
  });

  afterAll(async () => {
    await app.close();
  });
});
