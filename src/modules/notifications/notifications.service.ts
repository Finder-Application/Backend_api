import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Users } from 'database/entities/Users';
import { PostPageOptionsDto } from 'modules/post/dtos/post-page-options.dto';
import { Repository } from 'typeorm';
import {
  CountNotificationDto,
  NotificationCmtDto,
  NotificationPostDto,
} from './dtos/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(CommentNotifications)
    private comNotiRepository: Repository<CommentNotifications>,
    @InjectRepository(PostNotifications)
    private postNotiRepository: Repository<PostNotifications>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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

    return items.toPageDto(pageMetaDto);
  }
}
