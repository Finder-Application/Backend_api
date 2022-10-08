import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'database/entities/Comments';
import { SubComments } from 'database/entities/SubComments';
import { CommentService } from './comment.service';
import {
  CommentController,
  CommentPublicController,
} from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, SubComments])],
  controllers: [CommentController, CommentPublicController],
  providers: [CommentService],
})
export class CommentModule {}
