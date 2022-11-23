import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'modules/auth/auth.middleware';
import { AuthModule } from 'modules/auth/auth.module';
import { CommentModule } from 'modules/comments/comments.module';
import { NotificationModule } from 'modules/notifications/notifications.module';
import { PostModule } from 'modules/post/post.module';
import { UserModule } from 'modules/user/user.module';
import { UtilModule } from 'modules/utils/util.module';
import { SharedModule } from 'shared/shared.module';
import './boilerplate.polyfill';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { ApiConfigService } from './shared/services/api-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        config: {
          url: configService.redisConfig,
        },
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        ...configService.postgresConfig,
      }),

      inject: [ApiConfigService],
    }),
    EventEmitterModule.forRoot(),
    HealthCheckerModule,
    AuthModule,
    NotificationModule,
    UserModule,
    CommentModule,
    PostModule,
    UtilModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/private');
  }
}
