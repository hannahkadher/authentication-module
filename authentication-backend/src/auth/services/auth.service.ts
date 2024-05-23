import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../users';
import { CreateUserDto } from '../dto';
import { config } from '../config';
import { SuccessResponseDto } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a user by their email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The validated user or null if validation fails.
   */
  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  /**
   * Registers a new user.
   * @param createUserDto - Data transfer object containing user registration information.
   * @returns The created user information.
   */
  async signUp(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const username = createUserDto.name;
    const password = createUserDto.password;

    return this.userService.createUser(email, username, password);
  }

  /**
   * Logs in a user and generates JWT access and refresh tokens.
   * @param user - The user object containing username and userId.
   * @returns An object containing access and refresh tokens.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_AT,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_AT,
    });

    return new SuccessResponseDto({
      data: { accessToken, refreshToken },
      message: `User authenticated successfully`,
    });
  }

  /**
   * Refreshes the JWT access token using the provided refresh token.
   * @param token - The old refresh token.
   * @returns An object containing a new access token.
   * @throws InternalServerErrorException if the token refresh fails.
   */
  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      const newPayload = { username: payload.username, sub: payload.sub };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_AT,
      });
      return new SuccessResponseDto({
        data: {
          accessToken,
        },
        message: `Refreshed token successfully`,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to refresh token`);
    }
  }

  /**
   * Verifies the provided JWT token.
   * @param token - The JWT token to verify.
   * @returns The decoded token if verification is successful.
   * @throws InternalServerErrorException if token verification fails.
   */
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to verify token`);
    }
  }
}
