import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Posts } from 'database/entities/Posts';
import { Users } from 'database/entities/Users';
import { firebase } from 'googleapis/build/src/apis/firebase';
import { PostPageOptionsDto } from 'modules/post/dtos/post-page-options.dto';
import { Repository } from 'typeorm';
import {
  CountNotificationDto,
  NotificationCmtDto,
  NotificationPostDto,
} from './dtos/notification.dto';

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { FirebaseService } from 'modules/firebase/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(CommentNotifications)
    private comNotiRepository: Repository<CommentNotifications>,
    @InjectRepository(PostNotifications)
    private postNotiRepository: Repository<PostNotifications>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    @InjectRedis('persist')
    private readonly redis: Redis,
    private firebase: FirebaseService,
  ) {}

  //TODO: count all notification
  async countNotifications(userId: number): Promise<CountNotificationDto> {
    const [postNoti, cmtNoti] = await Promise.all([
      this.postNotiRepository.count({
        where: {
          userId,
          seen: false,
        },
      }),
      this.comNotiRepository.count({
        where: {
          userId,
          seen: false,
        },
      }),
    ]);

    return {
      count: postNoti + cmtNoti,
    };
  }

  async getCmtNotifications(
    userId: number,
    pageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationCmtDto>> {
    const queryBuilder = this.comNotiRepository
      .createQueryBuilder('comNotiRepository')
      .leftJoinAndSelect('comNotiRepository.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comNotiRepository.userId = :userId', { userId });

    const [items, pageMetaDto] = await queryBuilder.paginate(
      pageOptionsDto,
      e => new NotificationCmtDto(e),
      'comNotiRepository',
    );

    return items.toPageDto(pageMetaDto);
  }

  async getPostNotifications(
    userId: number,
    pageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationPostDto>> {
    const queryBuilder = this.postNotiRepository
      .createQueryBuilder('postNotiRepository')
      .leftJoinAndSelect('postNotiRepository.user', 'user')
      .where('postNotiRepository.userId = :userId', { userId });

    const [items, pageMetaDto] = await queryBuilder.paginate(
      pageOptionsDto,
      e => new NotificationPostDto(e),
      'postNotiRepository',
    );

    const itemsConverted = await Promise.all(
      items.map(async item => {
        const { photos } = (await this.postRepository.findOne({
          where: {
            id: item.postId,
            isActive: true,
            userId: item.userId,
          },
          select: {
            photos: true,
          },
        })) || { photos: '' };

        return {
          ...item,
          photo: photos?.split(',')[0],
        };
      }),
    );
    return itemsConverted.toPageDto(pageMetaDto);
  }

  async createCommentNotification(
    userId: number,
    postId: number,
    commentId: number,
    content: string,
  ) {
    // create a new comment notification
    const newCommentNotification = this.comNotiRepository.create({
      userId,
      postId,
      commentId,
      content,
      seen: false,
    });

    await this.comNotiRepository.save(newCommentNotification);

    const queryBuilder = await this.comNotiRepository
      .createQueryBuilder('comNotiRepository')
      .leftJoinAndSelect('comNotiRepository.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comNotiRepository.id = :id', { id: newCommentNotification.id })
      .getOne();

    if (queryBuilder) {
      return new NotificationCmtDto(queryBuilder);
    }
  }

  async installFCM(userId: number, token: string) {
    await this.redis.del(userId.toString() + '_token');
    const data = await this.redis.sadd(userId.toString() + '_token', token);
    return new ResponseSuccessDto('installFCM success', data);
  }

  async seenNotification(notiId: number, type: string) {
    const checkBeforeUpdate = await (type === 'post'
      ? this.postNotiRepository
      : this.comNotiRepository
    ).findOne({
      where: {
        id: notiId,
      },
    });

    if (checkBeforeUpdate?.seen) {
      return;
    }

    await (type === 'post'
      ? this.postNotiRepository.update(notiId, { seen: true })
      : this.comNotiRepository.update(notiId, { seen: true }));

    return new ResponseSuccessDto('seenNotification success');
  }

  async pushNotification(
    userId: number,
    title: string,
    body: string,
    postId: number,
  ) {
    try {
      const userToken = await this.redis.smembers(userId.toString() + '_token');

      await this.firebase.fcm.send({
        token: userToken[0],
        notification: {
          title,
          body,
        },
        data: {
          postId: postId.toString(),
        },
      });
    } catch (error) {
      throw new BadRequestException('Token not valid');
    }

    return new ResponseSuccessDto('Send notification success', {});
  }
}
