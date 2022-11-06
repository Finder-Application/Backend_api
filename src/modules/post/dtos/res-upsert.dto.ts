import { PostResDto } from './post-res.dto';
export class ResponsePostDto {
  private data: PostResDto;
  constructor(post: PostResDto) {
    this.data = post;
  }
}
