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

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  async signUp(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const username = createUserDto.name;
    const password = createUserDto.password;

    return this.userService.createUser(email, username, password);
  }

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

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to verify token`);
    }
  }
}
