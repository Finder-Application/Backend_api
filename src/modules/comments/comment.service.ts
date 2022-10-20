import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { Comments } from 'database/entities/Comments';
import { SubComments } from 'database/entities/SubComments';
import { Session } from 'interfaces/request';
import { Repository } from 'typeorm';
import { CommentDto, CommentIdDto, CreateCommentDto } from './dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(SubComments)
    private subCommentsRepository: Repository<SubComments>,
  ) {}

  async createComment(createComment: CreateCommentDto, session: Session) {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    createComment.repFor
      ? await this.subCommentsRepository.save(comment)
      : await this.commentsRepository.save(comment);

    return comment;
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

  async deleteComment(id: number) {
    const findComment = await this.commentsRepository
      .createQueryBuilder()
      .delete()
      .where('comments.id = :id', { id })
      .execute();

    if (!findComment.affected) {
      throw new NotFoundException('Your comment not exit!!');
    }
  }
}
