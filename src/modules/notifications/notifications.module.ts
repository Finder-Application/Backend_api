import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Users } from 'database/entities/Users';
import { AuthModule } from 'modules/auth/auth.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notifications.getway';
import { NotificationService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentNotifications, PostNotifications, Users]),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
