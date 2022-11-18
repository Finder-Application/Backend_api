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

import { ResponseSuccessDto } from 'common/dto/response.dto';
import { RelevantNetworkPosts } from 'database/entities/RelevantNetworkPosts';
import { Session } from 'interfaces/request';

import { ApiPageOkResponse, Auth, GetSession } from '../../decorators';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostResDto } from './dtos/post-res.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('private/posts')
@ApiTags('Posts API Private')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('relevant/:id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Array<PostResDto> })
  async getRelevantPost(@Param('id') id: Uuid): Promise<PostResDto[]> {
    return this.postService.getPostRelevant(Number(id));
  }

  @Get('relevant-network/:id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Array<RelevantNetworkPosts> })
  async getRelevantNetwork(
    @Param('id') id: Uuid,
  ): Promise<RelevantNetworkPosts[]> {
    return this.postService.getPostRelevantNetwork(Number(id));
  }
  @Post()
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostResDto })
  async createSinglePost(
    @Body() createPost: CreatePostDto,
    @GetSession() session: Session,
  ) {
    return this.postService.createSinglePost(createPost, session.userId);
  }

  @Put(':id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updatePost(@Param('id') id: Uuid, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @Auth({ public: false })
  @ApiAcceptedResponse({ type: ResponseSuccessDto })
  async deletePost(@Param('id') id: Uuid): Promise<ResponseSuccessDto | null> {
    try {
      return this.postService.deletePost(id);
    } catch (error) {
      console.error('error', error);
      return null;
    }
  }
}

@Controller('public/posts')
@ApiTags('Posts API Public')
export class PostPublicController {
  constructor(private postService: PostService) {}

  @Get()
  @ApiPageOkResponse({ type: PostResDto })
  getPostsPagination(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @GetSession() session: Session,
  ) {
    return this.postService.getPostsPagination(pageOptionsDto, session?.userId);
  }

  @Get(':id')
  @Auth({ public: false })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostResDto })
  async getSinglePost(@Param('id') id: Uuid) {
    return this.postService.getSinglePost(id);
  }
}
