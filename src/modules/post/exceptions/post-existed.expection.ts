import { BadRequestException } from '@nestjs/common';
import { PostResDto } from '../dtos/post-res.dto';

export class PostExistedException extends BadRequestException {
  constructor(post: PostResDto, message: string) {
    super({
      data: post,
      message,
    });
  }
}
