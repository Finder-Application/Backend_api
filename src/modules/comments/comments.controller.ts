import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { ApiPageOkResponse, GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { CommentService } from './comment.service';
import { CommentDto, CommentIdDto, CreateCommentDto } from './dtos/comment.dto';

@Controller('private/comments')
@ApiTags('Comments Api')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  @ApiPageOkResponse({ type: CommentDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  getPostsPagination(
    @Query() postId: CommentIdDto,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    return this.commentService.getPagination(pageOptionsDto, postId.id);
  }

  @Post()
  createOneComment(
    @Body() createComment: CreateCommentDto,
    @GetSession() session: Session,
  ) {
    return this.commentService.createComment(createComment, session);
  }

  @Post('up-like')
  upLikeOneComment(@Body() likeComment: CommentIdDto) {
    return this.commentService.upLikeComment(likeComment);
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
