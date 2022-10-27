import { BadRequestException } from '@nestjs/common';
import { PostConvertToResDto } from '../dtos/post-res.dto';

export class PostExistedException extends BadRequestException {
  constructor(post: PostConvertToResDto, message: string) {
    super({
      data: post,
      message,
    });
  }
}
