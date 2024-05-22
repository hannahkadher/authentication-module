import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services';
import { UserModule } from '../users';
import { LocalStrategy } from './strategy';
import { AuthController } from './controller';
import { config } from './config';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: config.JWT_ACCESS_TOKEN_EXPIRES_AT },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
