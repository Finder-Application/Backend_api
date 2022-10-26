import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'common/dto/page-options.dto';
import { PageDto } from 'common/dto/page.dto';
import { Session } from 'interfaces/request';

import { ApiPageOkResponse, Auth, GetSession } from '../../decorators';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostConvertToResDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('private/posts')
@ApiTags('Posts API Private')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostConvertToResDto })
  async createSinglePost(
    @Body() createPost: CreatePostDto,
    @GetSession() session: Session,
  ) {
    return this.postService.createSinglePost(createPost, session.userId);
  }

  @Get()
  @ApiPageOkResponse({ type: PostConvertToResDto })
  getPostsPagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @GetSession() session: Session,
  ): Promise<PageDto<PostConvertToResDto>> {
    return this.postService.getPostsPagination(pageOptionsDto, session.userId);
  }

  @Get(':id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostConvertToResDto })
  async getSinglePost(@Param('id') id: Uuid) {
    return this.postService.getSinglePost(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updatePost(
    @Param('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deletePost(@Param('id') id: Uuid): Promise<void> {
    await this.postService.deletePost(id);
  }
}

@Controller('public/posts')
@ApiTags('Posts API Public')
export class PostPublicController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiPageOkResponse({ type: PostConvertToResDto })
  getPostsPagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostConvertToResDto>> {
    return this.postService.getPostsPagination(pageOptionsDto);
  }
}
