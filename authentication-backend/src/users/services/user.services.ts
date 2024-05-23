import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MongoError } from 'mongodb';

import { User } from '../../schema';

import { UserRepository } from '../repositories';

import {
  MongooseErrorCode,
  BaseResponseDto,
  SuccessResponseDto,
} from '../../utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Creates a new user with the provided email, name, and password.
   * @param email - The email address of the new user.
   * @param name - The name of the new user.
   * @param password - The plain text password of the new user.
   * @returns A response DTO containing the created user data.
   * @throws BadRequestException if the email already exists.
   * @throws InternalServerErrorException if user creation fails for other reasons.
   */
  async createUser(
    email: string,
    name: string,
    password: string,
  ): Promise<BaseResponseDto> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.createUser({
        email,
        name,
        password: hashedPassword,
      });
      return new SuccessResponseDto<User>({
        data: newUser,
        message: 'User created successfully',
      });
    } catch (error) {
      this.logger.error(
        `Error while creating user. Error = ${JSON.stringify(error.message)}`,
      );

      if (
        error instanceof MongoError &&
        error.code === MongooseErrorCode.DUPLICATE_KEY
      ) {
        throw new BadRequestException(
          `Error while creating user. Email ${email} already exists.`,
        );
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address of the user to find.
   * @returns The user if found, or null if not found.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }

  /**
   * Validates a user by their email and password.
   * @param email - The email address of the user.
   * @param password - The plain text password of the user.
   * @returns A response DTO containing the authenticated user data.
   * @throws NotFoundException if the user is not found.
   * @throws UnauthorizedException if the password is invalid.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<BaseResponseDto> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException(`User not found for email ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return new SuccessResponseDto<User>({
      data: user,
      message: 'User authenticated successfully',
    });
  }
}
