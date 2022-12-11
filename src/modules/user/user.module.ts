import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'database/entities/Accounts';
import { Users } from 'database/entities/Users';
import { ApiConfigService } from 'shared/services/api-config.service';

import { UserController, UserPublicController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Accounts]),

    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [UserController, UserPublicController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
