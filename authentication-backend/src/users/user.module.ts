import { Module } from '@nestjs/common';
import { UserService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema';
import { UserRepository } from './repositories';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
