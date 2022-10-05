import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'database/entities/Comments';
import { CommentService } from './comment.service';
import {
  CommentController,
  CommentPublicController,
} from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  controllers: [CommentController, CommentPublicController],
  providers: [CommentService],
})
export class CommentModule {}
