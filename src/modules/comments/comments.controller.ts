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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { ApiPageOkResponse, GetSession } from 'decorators';
import { Session } from 'interfaces/request';
import { CommentService } from './comment.service';
import {
  CommentDto,
  CommentIdDto,
  CreateCommentDto,
  TotalComment,
} from './dtos/comment.dto';

@Controller('private/comments')
@ApiTags('Comments Api')
@ApiBearerAuth()
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
  upLikeOneComment(@Body() likeComment: CommentIdDto) {
    return this.commentService.upLikeComment(likeComment);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseSuccessDto })
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}

@Controller('public/comments')
@ApiTags('Public Comments Api')
export class CommentPublicController {
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

  // get count comment
  @Get('count')
  @ApiOkResponse({ type: TotalComment })
  getCountComment(@Query() postId: CommentIdDto) {
    return this.commentService.countTotalComment(postId.id);
  }
}
