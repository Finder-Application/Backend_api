import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { CommentService } from './comment.service';
import { CreateCommentDto, LikeCommentDto } from './dtos/comment.dto';

@Controller('private/comments')
@ApiTags('Comments Api')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  createOneComment(
    @Body() createComment: CreateCommentDto,
    @GetSession() session: Session,
  ) {
    return this.commentService.createComment(createComment, session);
  }

  @Post('up-like')
  upLikeOneComment(@Body() likeComment: LikeCommentDto) {
    return this.commentService.upLikeComment(likeComment);
  }

  @Get()
  getPaginationComments() {
    return 'getPaginationComments';
  }

  @Delete(':id')
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}

@Controller('public/comments')
@ApiTags('Public Comments Api')
export class CommentPublicController {
  @Get()
  getPaginationComment() {
    return 'getPaginationComment';
  }
}
