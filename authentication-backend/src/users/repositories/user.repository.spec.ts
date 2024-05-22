import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from './user.respository';
import { User } from '../../schema';

const mockUserInstance = {
  save: jest.fn(),
};

const mockUserModel = jest
  .fn()
  .mockImplementation(() => mockUserInstance) as jest.MockedFunction<any>;
mockUserModel.findOne = jest.fn();

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: Partial<User> = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
      const savedUser = { ...user, _id: 'someId' };

      mockUserInstance.save.mockResolvedValue(savedUser);

      const result = await userRepository.createUser(user);

      expect(mockUserModel).toHaveBeenCalledWith(user);
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });

    it('should handle save errors gracefully', async () => {
      const user: Partial<User> = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
      const saveError = new Error('Save failed');

      mockUserInstance.save.mockRejectedValue(saveError);

      await expect(userRepository.createUser(user)).rejects.toThrow(
        'Save failed',
      );

      expect(mockUserModel).toHaveBeenCalledWith(user);
      expect(mockUserInstance.save).toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { email, name: 'Test User', password: 'password' };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await userRepository.findUserByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@example.com';

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await userRepository.findUserByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });

    it('should handle findOne errors gracefully', async () => {
      const email = 'test@example.com';
      const findOneError = new Error('Find failed');

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(findOneError),
      } as any);

      await expect(userRepository.findUserByEmail(email)).rejects.toThrow(
        'Find failed',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
    });
  });
});
