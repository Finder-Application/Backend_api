import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Users } from 'database/entities/Users';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentNotifications, PostNotifications, Users]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
