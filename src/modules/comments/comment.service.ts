import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'database/entities/Comments';
import { Session } from 'interfaces/request';
import { Repository } from 'typeorm';
import { CreateCommentDto, LikeCommentDto } from './dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  async createComment(createComment: CreateCommentDto, session: Session) {
    const comment = this.commentsRepository.create({
      postId: createComment.postId,
      content: createComment.content,
      photo: createComment.photo,
      repFor: createComment.repFor,
      userId: session.userId,
    });

    await this.commentsRepository.save(comment);

    return comment;
  }

  async upLikeComment(likeComment: LikeCommentDto) {
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
      throw new NotFoundException('Your comment not exit!');
    }
  }
}
