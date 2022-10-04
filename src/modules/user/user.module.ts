import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'database/entities/Users';

import { UserController, UserPublicController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController, UserPublicController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
