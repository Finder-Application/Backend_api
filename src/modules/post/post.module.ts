import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Posts } from 'database/entities/Posts';
import { FirebaseModule } from 'modules/firebase/firebase.module';
import { PostController, PostPublicController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), FirebaseModule],
  providers: [PostService],
  controllers: [PostController, PostPublicController],
})
export class PostModule {}
