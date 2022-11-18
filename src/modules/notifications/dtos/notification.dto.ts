import { ApiProperty } from '@nestjs/swagger';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

export class NotificationCmtDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: UserPublicDto;

  constructor(cmtNoti: CommentNotifications) {
    this.id = cmtNoti.id;
    this.postId = cmtNoti.postId;
    this.content = cmtNoti.content;
    this.createdAt = cmtNoti.createdAt;
    this.updatedAt = cmtNoti.updatedAt;
    this.user = new UserPublicDto(cmtNoti.comment.user);
  }
}

export class NotificationPostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: UserPublicDto;

  constructor(postNoti: PostNotifications) {
    this.id = postNoti.id;
    this.postId = postNoti.postId;
    this.content = postNoti.content;
    this.title = postNoti.title;
    this.createdAt = postNoti.createdAt;
    this.updatedAt = postNoti.updatedAt;
    this.user = new UserPublicDto(postNoti.user);
  }
}

export class CountNotificationDto {
  @ApiProperty()
  count: number;
}
