import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('private/comments')
@ApiTags('Comments Api')
export class CommentController {
  @Post()
  createOneComment() {
    return 'createOneComment';
  }

  @Delete()
  deleteOneComment() {
    return 'createOneComment';
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
