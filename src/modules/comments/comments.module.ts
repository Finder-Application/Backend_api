import { Module } from '@nestjs/common';
import {
  CommentController,
  CommentPublicController,
} from './comments.controller';

@Module({
  controllers: [CommentController, CommentPublicController],
  providers: [],
})
export class CommentModule {}
