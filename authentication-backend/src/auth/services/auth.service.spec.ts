import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../../users';
import { CreateUserDto } from '../dto';
import { SuccessResponseDto } from '../../utils';
import { config } from '../config';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    validateUser: jest.fn(),
    createUser: jest.fn(),
  };

  const JwtServiceMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user using UserService', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const validatedUser = { email, name: 'Test User' };

      mockUserService.validateUser.mockResolvedValue(validatedUser);

      const result = await authService.validateUser(email, password);

      expect(userService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(validatedUser);
    });
  });

  describe('signUp', () => {
    it('should create a new user using UserService', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
      const createdUser = { ...createUserDto, _id: 'someId' };

      mockUserService.createUser.mockResolvedValue(createdUser);

      const result = await authService.signUp(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password,
      );
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return SuccessResponseDto with access_token', async () => {
      const user = { username: 'username', userId: 'userId' };
      const accessToken = 'token';
      const refreshToken = 'token';

      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      const result = await authService.login(user);

      expect(signSpy).toHaveBeenCalledTimes(2);
      expect(signSpy).toHaveBeenCalledWith(
        { username: user.username, sub: user.userId },
        { expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_AT },
      );
      expect(signSpy).toHaveBeenCalledWith(
        { username: user.username, sub: user.userId },
        { expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_AT },
      );

      expect(result).toEqual(
        new SuccessResponseDto({
          data: { accessToken: accessToken, refreshToken },
          message: 'User authenticated successfully',
        }),
      );
    });
  });

  describe('refresh', () => {
    it('should return a new access token', async () => {
      const token = 'refresh_token';
      const payload = { username: 'testuser', sub: '123' };
      const newAccessToken = 'new_access_token';

      JwtServiceMock.verify.mockReturnValue(payload);
      jest.spyOn(jwtService, 'sign').mockReturnValue(newAccessToken);

      const result = await authService.refresh(token);

      expect(result.data).toEqual({ accessToken: newAccessToken });
      expect(result.message).toEqual('Refreshed token successfully');
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        ignoreExpiration: true,
      });
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_AT,
      });
    });

    it('should throw an error if token refresh fails', async () => {
      const token = 'invalid_token';

      JwtServiceMock.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.refresh(token)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify and return the payload', async () => {
      const token = 'valid_token';
      const payload = { username: 'testuser', sub: '123' };

      JwtServiceMock.verify.mockReturnValue(payload);

      expect(await authService.verifyToken(token)).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw an error if token verification fails', async () => {
      const token = 'invalid_token';

      JwtServiceMock.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.verifyToken(token)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
