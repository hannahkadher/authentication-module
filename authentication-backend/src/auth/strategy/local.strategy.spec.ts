import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate user using AuthService', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { email, name: 'Test User' };

      mockAuthService.validateUser.mockResolvedValue(user);

      const result = await localStrategy.validate(email, password);

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
