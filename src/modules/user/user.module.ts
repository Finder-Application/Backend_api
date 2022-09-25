import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController, UserPublicController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [UserController, UserPublicController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
