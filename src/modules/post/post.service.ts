import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { Posts } from 'database/entities/Posts';
import { FirebaseService } from 'modules/firebase/firebase.service';
import { ApiConfigService } from 'shared/services/api-config.service';
import { Repository } from 'typeorm';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostConvertToDBDto } from './dtos/post-convert.dto';
import { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostConvertToResDto } from './dtos/post.dto';
import type { UpdatePostDto } from './dtos/update-post.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
    private validatorService: ValidatorService,
    private commandBus: CommandBus,
    private apiConfig: ApiConfigService,
    private firebase: FirebaseService,
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
  ): Promise<PageDto<PostConvertToResDto>> {
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
        e => new PostConvertToResDto(e),
      );

      return items.toPageDto<PostConvertToResDto>(pageMetaDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSinglePost(id: Uuid): Promise<PostConvertToResDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id })
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.account', 'account');

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return new PostConvertToResDto(postEntity);
  }

  async createSinglePost(
    createPost: CreatePostDto,
    userId: number,
  ): Promise<PostConvertToResDto> {
    const { descriptors, ...postData } = createPost;

    const post = this.postRepository.create({
      ...new PostConvertToDBDto(postData),
      userId,
    });

    const postCreated = await this.postRepository.save(post);
    if (!postCreated.id) {
      throw new PostNotFoundException();
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id: postCreated.id })
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.account', 'account');

    const [postEntity] = await Promise.all([
      queryBuilder.getOne(),
      this.firebase.saveDescriptors(descriptors),
    ]);

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return new PostConvertToResDto(postEntity);
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

  async deletePost(id: Uuid): Promise<ResponseSuccessDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id });

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.remove(postEntity);

    return new ResponseSuccessDto('Delete post success', { id });
  }
}
