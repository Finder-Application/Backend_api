/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { EVENT_REDIS, PUSH_NOTIFICATION_COMMENT } from 'constants/event-emit';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { Comments } from 'database/entities/Comments';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Posts } from 'database/entities/Posts';
import { Session } from 'interfaces/request';
import { AuthService } from 'modules/auth/auth.service';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import {
  NotificationPostDto,
  TakeNotificationFormBot,
  TakeNotificationFormCreateComment,
} from './dtos/notification.dto';
import { NotificationService } from './notifications.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/api/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    @InjectRepository(CommentNotifications)
    private comNotiRepository: Repository<CommentNotifications>,
    @InjectRepository(PostNotifications)
    private postNotiRepository: Repository<PostNotifications>,
  ) {
    this.listonEventPushNotification();
  }

  listonEventPushNotification() {
    this.redis.subscribe(EVENT_REDIS.NEW_INFO_POST).catch(() => null);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.redis.on('message', async (channel, message) => {
      await this.handler(message as string);
    });
  }

  @WebSocketServer()
  server: Socket;

  getRoomNotify = (userId: number) => `room-notify-${userId}`;

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token?.toString();

    try {
      const decode = this.authService.validateJwt(token || '') as Session;
      const nameRoom = this.getRoomNotify(decode.userId);
      (client.request as any).session = decode;

      await client.join(nameRoom);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.pushTotalNotification(decode.userId);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.info('client out', client.id);
  }

  async pushTotalNotification(userId: number) {
    const nameRoom = this.getRoomNotify(userId);
    const { count } = await this.notificationService.countNotifications(userId);
    this.server.to(nameRoom).emit('take-total-notification', count);
  }

  @SubscribeMessage('seen-notification')
  async handleSeenNotification(
    client: Socket,
    payload: { id: number; type: 'post' | 'comment' },
  ) {
    const { userId } = (client.request as any).session as Session;
    const { id, type } = payload;

    const checkBeforeUpdate = await (type === 'post'
      ? this.postNotiRepository
      : this.comNotiRepository
    ).findOne({
      where: {
        id,
      },
    });

    if (checkBeforeUpdate?.seen) {
      return;
    }

    const value = await (type === 'post'
      ? this.postNotiRepository.update(id, { seen: true })
      : this.comNotiRepository.update(id, { seen: true }));

    if (value.affected) {
      const nameRoom = this.getRoomNotify(userId);
      this.server.to(nameRoom).emit('reduce-notification');
    }
  }

  @OnEvent(PUSH_NOTIFICATION_COMMENT)
  // eslint-disable-next-line sonarjs/cognitive-complexity
  async handlePushNewNotification(payload: TakeNotificationFormCreateComment) {
    const {
      commentId,
      isReply,
      postId,
      userCreateComment: userCreateComment,
    } = payload;

    if (isReply) {
      const [post, comment] = await Promise.all([
        this.postRepository.findOne({
          where: {
            id: postId,
          },
          relations: ['user'],
        }),
        this.commentsRepository.findOne({
          where: {
            id: commentId,
          },
          relations: ['user'],
        }),
      ]);

      if (!(post && comment)) {
        return 0;
      }

      const userIdCreatePost = post.user.id;

      const userIdCreateComment = comment.user.id;

      const userIdCreateSubComment = userCreateComment.userId;

      // case 1 use create subComment is user create post , is user create comment => not push notification
      if (
        userIdCreateComment === userIdCreateSubComment &&
        userIdCreatePost === userIdCreateSubComment
      ) {
        return 0;
      }

      // case 2 user create subComment is user create post => push notification to user create comment
      if (userIdCreatePost === userIdCreateSubComment) {
        const commentNotificationForUserCreateComment =
          await this.notificationService.createCommentNotification(
            userIdCreateComment,
            postId,
            commentId,
            `${userCreateComment.lastName} reply on your comment`,
          );

        const roomUserCreateComment = this.getRoomNotify(userIdCreateComment);
        // push notification for user create comment
        if (commentNotificationForUserCreateComment) {
          this.server.to(roomUserCreateComment).emit(
            'new-notification',
            JSON.stringify({
              type: 'comment',
              data: commentNotificationForUserCreateComment,
            }),
          );
          this.server.to(roomUserCreateComment).emit('increase-notification');
        }

        return 0;
      }

      // case 3 user create subComment is user create comment => push notification to user create post
      if (userIdCreateComment === userIdCreateSubComment) {
        const commentNotificationForUserCreatePost =
          await this.notificationService.createCommentNotification(
            userIdCreatePost,
            postId,
            commentId,
            `${userCreateComment.lastName} reply on your post`,
          );

        const roomUserCreatePost = this.getRoomNotify(userIdCreatePost);
        // push notification for user create comment
        if (commentNotificationForUserCreatePost) {
          this.server.to(roomUserCreatePost).emit(
            'new-notification',
            JSON.stringify({
              type: 'comment',
              data: commentNotificationForUserCreatePost,
            }),
          );
          this.server.to(roomUserCreatePost).emit('increase-notification');
        }

        return 0;
      }

      // case 4 user create subComment is not user create post and user create comment
      // => push notification to user create post and user create comment

      const [
        commentNotificationForUserCreatePost,
        commentNotificationForUserCreateComment,
      ] = await Promise.all([
        this.notificationService.createCommentNotification(
          userIdCreatePost,
          postId,
          commentId,
          `${userCreateComment.lastName} commented on your post`,
        ),

        this.notificationService.createCommentNotification(
          userIdCreateComment,
          postId,
          commentId,
          `${userCreateComment.lastName} reply on your comment`,
        ),
      ]);

      const roomUserCreatePost = this.getRoomNotify(userIdCreatePost);
      const roomUserCreateComment = this.getRoomNotify(userIdCreateComment);

      if (commentNotificationForUserCreatePost) {
        this.server.to(roomUserCreatePost).emit(
          'new-notification',
          JSON.stringify({
            type: 'comment',
            data: commentNotificationForUserCreatePost,
          }),
        );
        this.server.to(roomUserCreatePost).emit('increase-notification');
      }
      // push notification for user create comment
      if (commentNotificationForUserCreateComment) {
        this.server.to(roomUserCreateComment).emit(
          'new-notification',
          JSON.stringify({
            type: 'comment',
            data: commentNotificationForUserCreateComment,
          }),
        );
        this.server.to(roomUserCreateComment).emit('increase-notification');
      }
    } else {
      // create comment notification for user create post

      const post = await this.postRepository.findOne({
        where: {
          id: postId,
        },
        relations: ['user'],
      });

      if (!post) {
        return 0;
      }

      const userIdCreatePost = post.user.id;

      if (userIdCreatePost === userCreateComment.userId) {
        return 0;
      }

      // create comment notification for user create post and user create comment
      const commentNoti1 =
        await this.notificationService.createCommentNotification(
          userIdCreatePost,
          postId,
          commentId,
          `${userCreateComment.userName} commented on your post`,
        );

      // push notification for user create post
      const nameRoom = this.getRoomNotify(userIdCreatePost);

      if (commentNoti1) {
        this.server.to(nameRoom).emit(
          'new-notification',
          JSON.stringify({
            type: 'comment',
            data: commentNoti1,
          }),
        );

        this.server.to(nameRoom).emit('increase-notification');
      }
    }
  }

  async handler(payload: string) {
    const parse = JSON.parse(payload) as TakeNotificationFormBot;

    const nameRoom = this.getRoomNotify(parse.user_id);

    const queryBuilder = this.postNotiRepository
      .createQueryBuilder('postNotiRepository')
      .leftJoinAndSelect('postNotiRepository.user', 'user')
      .where('postNotiRepository.userId = :userId', { userId: parse.user_id })
      .andWhere('postNotiRepository.postId = :postId', {
        postId: parse.post_id,
      })
      .getOne();

    const data = await queryBuilder;

    if (data) {
      const dataSendToClient = new NotificationPostDto(data);
      this.server.to(nameRoom).emit(
        'new-notification',
        JSON.stringify({
          type: 'post',
          data: dataSendToClient,
        }),
      );
      this.server.to(nameRoom).emit('increase-notification');
    }
  }
}
