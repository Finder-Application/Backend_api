import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Posts } from 'database/entities/Posts';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
