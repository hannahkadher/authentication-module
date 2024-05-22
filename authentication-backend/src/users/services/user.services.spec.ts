import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MongoError } from 'mongodb';
import { UserService } from './user.services';
import { UserRepository } from '../repositories';
import { User } from '../../schema';
import { MongooseErrorCode, SuccessResponseDto } from '../../utils';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            findUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'password';
      const hashedPassword = 'hashedPassword';
      const newUser = { email, name, password: hashedPassword } as User;

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (userRepository.createUser as jest.Mock).mockResolvedValue(newUser);

      const result = await userService.createUser(email, name, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email,
        name,
        password: hashedPassword,
      });
      expect(result).toEqual(
        new SuccessResponseDto<User>({
          data: newUser,
          message: 'User created successfully',
        }),
      );
    });

    it('should handle duplicate email error', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'password';
      const mongoError = new MongoError('Duplicate key error');
      mongoError.code = MongooseErrorCode.DUPLICATE_KEY;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockRejectedValue(mongoError);

      await expect(
        userService.createUser(email, name, password),
      ).rejects.toThrow(
        new BadRequestException(
          `Error while creating user. Email ${email} already exists.`,
        ),
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email,
        name,
        password: 'hashedPassword',
      });
    });

    it('should handle internal server error', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const password = 'password';
      const error = new Error('Internal server error');

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.createUser(email, name, password),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create user'),
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email,
        name,
        password: 'hashedPassword',
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { email, name: 'Test User', password: 'password' } as User;

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);

      const result = await userService.findUserByEmail(email);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@example.com';

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await userService.findUserByEmail(email);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        email,
        name: 'Test User',
        password: 'hashedPassword',
      } as User;

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.validateUser(email, password);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(result).toEqual(
        new SuccessResponseDto<User>({
          data: user,
          message: 'User authenticated successfully',
        }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.validateUser(email, password)).rejects.toThrow(
        new NotFoundException(`User not found for email ${email}`),
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        email,
        name: 'Test User',
        password: 'hashedPassword',
      } as User;

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userService.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException('Invalid password'),
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
  });
});
