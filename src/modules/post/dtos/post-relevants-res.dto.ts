import { Posts } from 'database/entities/Posts';
import { PostResDto } from './post-res.dto';

export class PostRelevantResDto extends PostResDto {
  private similar = 0;
  constructor(post: Posts, similar) {
    super(post);
    this.similar = similar;
  }
}
