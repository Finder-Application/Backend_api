import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { Posts } from 'database/entities/Posts';
import { Repository } from 'typeorm';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostDto } from './dtos/post.dto';
import type { UpdatePostDto } from './dtos/update-post.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    private validatorService: ValidatorService,
    private commandBus: CommandBus,
  ) {}

  //   @Transactional()
  //   createPost(userId: Uuid, createPostDto: CreatePostDto): Promise<PostEntity> {
  //     return this.commandBus.execute<CreatePostCommand, PostEntity>(
  //       new CreatePostCommand(userId, createPostDto),
  //     );
  //   }

  async getPostsPagination(
    pageOptionsDto: PostPageOptionsDto,
    userId?: number,
  ): Promise<PageDto<PostDto>> {
    try {
      const queryBuilder = this.postRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.user', 'user')
        .leftJoinAndSelect('user.account', 'account');

      if (userId) {
        queryBuilder.where('posts.userId = :userId', { userId });
      }

      const [items, pageMetaDto] = await queryBuilder.paginate(
        pageOptionsDto,
        e => new PostDto(e),
      );

      return items.toPageDto<PostDto>(pageMetaDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSinglePost(id: Uuid): Promise<PostDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id })
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.account', 'account');

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return new PostDto(postEntity);
  }

  async createSinglePost(
    createPost: CreatePostDto,
    userId: number,
  ): Promise<PostDto> {
    const post = this.postRepository.create({
      ...createPost,
      userId,
    });

    const postCreate = await this.postRepository.save(post);

    if (!postCreate.id) {
      throw new PostNotFoundException();
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id: postCreate.id })
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.account', 'account');

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return new PostDto(postEntity);
  }

  async updatePost(id: Uuid, updatePostDto: UpdatePostDto): Promise<void> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id });

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    this.postRepository.merge(postEntity, updatePostDto);

    await this.postRepository.save(updatePostDto);
  }

  async deletePost(id: Uuid): Promise<void> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id });

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.remove(postEntity);
  }
}
