import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { CommentNotifications } from 'database/entities/CommentNotifications';
import { PostNotifications } from 'database/entities/PostNotifications';
import { Users } from 'database/entities/Users';
import { PostPageOptionsDto } from 'modules/post/dtos/post-page-options.dto';
import { Repository } from 'typeorm';
import { CountNotificationDto, NotificationDto } from './dtos/notification.dto';

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
    const query = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'postNotifications.seen',
        'commentNotifications.seen',
      ])
      .leftJoinAndSelect(
        'user.postNotifications',
        'postNotifications',
        'postNotifications.seen = :isSeen',
        {
          isSeen: false,
        },
      )
      .leftJoinAndSelect(
        'user.commentNotifications',
        'commentNotifications',
        'commentNotifications.seen = :isSeen',
        {
          isSeen: false,
        },
      )
      .where('user.id = :id', { id: userId })
      .getOne();

    return {
      count:
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (query?.commentNotifications?.length || 0) +
        (query?.postNotifications?.length || 0),
    };
  }
  //   //TODO: pagination get notification
  async getPostNotifications(
    userId: number,
    postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<NotificationDto>> {
    const queryBuilder = this.postNotiRepository
      .createQueryBuilder('post')
      .where('post.userId = :userId', { userId });
    const [items, pageMetaDto] = await queryBuilder.paginate(
      postsPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  //   async getComNotifications(userId: number): Promise<PageDto<PostNotificationDto>> {
  //     const queryBuilder = this.postRepository
  //       .createQueryBuilder('post')
  //       .leftJoinAndSelect('post.translations', 'postTranslation');
  //     const [items, pageMetaDto] = await queryBuilder.paginate(
  //       postPageOptionsDto,
  //     );

  //     return items.toPageDto(pageMetaDto);
  //   }
}
