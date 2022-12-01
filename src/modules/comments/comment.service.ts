import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { PUSH_NOTIFICATION_COMMENT } from 'constants/event-emit';
import { Comments } from 'database/entities/Comments';
import { SubComments } from 'database/entities/SubComments';
import { Session } from 'interfaces/request';
import { TakeNotificationFormCreateComment } from 'modules/notifications/dtos/notification.dto';
import { Repository } from 'typeorm';
import { CommentDto, CommentIdDto, CreateCommentDto } from './dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(SubComments)
    private subCommentsRepository: Repository<SubComments>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createComment(createComment: CreateCommentDto, session: Session) {
    try {
      const comment = createComment.repFor
        ? this.subCommentsRepository.create({
            content: createComment.content,
            photo: createComment.photo,
            userId: session.userId,
            subFor: createComment.repFor,
          })
        : this.commentsRepository.create({
            postId: createComment.postId,
            content: createComment.content,
            photo: createComment.photo,
            userId: session.userId,
          });

      let userIdCreateCommentHead;
      if (createComment.repFor) {
        userIdCreateCommentHead = await this.commentsRepository.findOne({
          where: {
            id: createComment.repFor,
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      const createNewComment = createComment.repFor
        ? await this.subCommentsRepository.save(comment)
        : await this.commentsRepository.save(comment);

      this.eventEmitter.emit(PUSH_NOTIFICATION_COMMENT, {
        isReply:
          createComment.repFor &&
          userIdCreateCommentHead.userId !== session.userId
            ? true
            : false,
        postId: createComment.postId,
        commentId: createComment.repFor ?? createNewComment.id,
        userCreateComment: session,
      } as TakeNotificationFormCreateComment);

      return comment;
    } catch (error) {
      console.info(error);
    }
  }

  async getPagination(pageOptionsDto: PageOptionsDto, postId: number) {
    try {
      const queryBuilder = this.commentsRepository
        .createQueryBuilder('comments')
        .where('comments.postId = :postId', { postId })
        .leftJoinAndSelect('comments.subComments', 'sub')
        .leftJoinAndSelect('comments.user', 'user')
        .leftJoinAndSelect('user.account', 'account')
        .leftJoinAndSelect('sub.user', 'userSub')
        .leftJoinAndSelect('userSub.account', 'accountSub');

      const [items, pageMetaDto] = await queryBuilder.paginate(
        pageOptionsDto,
        e => new CommentDto(e),
        'comments',
      );

      return items.toPageDto<CommentDto>(pageMetaDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async upLikeComment(likeComment: CommentIdDto) {
    const comment = await this.commentsRepository
      .createQueryBuilder()
      .where('comments.id = :id', { id: likeComment.id })
      .update()
      .set({
        likes: () => 'likes + 1',
      })
      .execute();

    if (!comment.affected) {
      throw new NotFoundException('Your comment not exit!');
    }

    return this.commentsRepository.findOne({
      where: {
        id: likeComment.id,
      },
    });
  }

  async countTotalComment(postId: number) {
    // count all comment with postId from table comments and table subComments
    const totalComment = await this.commentsRepository

      .createQueryBuilder('comments')
      .where('comments.postId = :postId', { postId })
      .leftJoinAndSelect('comments.subComments', 'sub')
      .getMany();

    return {
      total: totalComment.reduce(
        (acc, cur) => acc + cur.subComments.length + 1,
        0,
      ),
    };
  }

  async deleteComment(id: number) {
    const findComment = await this.commentsRepository.findOne({
      where: {
        id,
      },
    });

    if (!findComment) {
      throw new NotFoundException('Your comment not exit!!');
    }

    await this.commentsRepository
      .createQueryBuilder()
      .delete()
      .where('comments.id = :id', { id })
      .execute();

    return new ResponseSuccessDto('Delete comment success', {
      id,
      postId: findComment.postId,
    });
  }
}
