import { Posts } from 'database/entities/Posts';
import { PostResDto } from './post-res.dto';

export class PostRelevantResDto extends PostResDto {
  private similar = 0;
  private similarText = 0;
  constructor(post: Posts, similar, similarText) {
    super(post);
    this.similar = similar;
    this.similarText = similarText;
  }
}
