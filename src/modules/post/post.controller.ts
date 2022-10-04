import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { PageDto } from 'common/dto/page.dto';

import { ApiPageOkResponse, Auth, UUIDParam } from '../../decorators';
import { PostDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiPageOkResponse({ type: PostDto })
  getPostsPagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    return this.postService.getPostsPagination(pageOptionsDto);
  }

  @Get(':id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostDto })
  async getSinglePost(@Param('id') id: Uuid) {
    return this.postService.getSinglePost(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updatePost(
    @UUIDParam('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deletePost(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.postService.deletePost(id);
  }
}
