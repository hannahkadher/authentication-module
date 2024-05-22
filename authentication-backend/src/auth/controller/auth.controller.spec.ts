import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as request from 'supertest';

import { AuthService } from '../services';
import { CreateUserDto, LoginDto } from '../dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { username: 'testuser', userId: '1' }; // mock user
          return true;
        },
      })
      .compile();
    app = module.createNestApplication();
    await app.init();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token on successful login', async () => {
      const loginDto: LoginDto = { email: 'testuser', password: 'testpass' };
      const expectedResponse = {
        accessToken: 'some-jwt-token',
        refreshToken: 'some-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(expectedResponse);
        });

      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        userId: '1',
      });
    });
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with CreateUserDto', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
      const createdUser = { ...createUserDto, id: '1' };

      mockAuthService.signUp.mockResolvedValue(createdUser);

      const result = await authController.signUp(createUserDto);

      expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
});
