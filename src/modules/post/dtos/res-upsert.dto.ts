import { PostConvertToResDto } from './post-res.dto';
export class ResponseUpsertPostDto {
  private data: PostConvertToResDto;
  constructor(post: PostConvertToResDto) {
    this.data = post;
  }
}
