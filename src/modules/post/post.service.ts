import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { Posts } from 'database/entities/Posts';
import { FirebaseService } from 'modules/firebase/firebase.service';
import { ApiConfigService } from 'shared/services/api-config.service';
import { In, Repository } from 'typeorm';
import { ValidatorService } from '../../shared/services/validator.service';
import { DateService } from './../../shared/services/Date.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDBDto } from './dtos/post-convert.dto';
import { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostResDto } from './dtos/post-res.dto';
import type { UpdatePostDto } from './dtos/update-post.dto';
import { PostExistedException } from './exceptions/post-existed.expection';
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

  async getPostsPagination(
    pageOptionsDto: PostPageOptionsDto,
    userId?: number,
  ): Promise<PageDto<PostResDto>> {
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
        e => new PostResDto(e),
      );

      return items.toPageDto<PostResDto>(pageMetaDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSinglePost(id: Uuid): Promise<PostResDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id })
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('user.account', 'account');

    const postEntity = await queryBuilder.getOne();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return new PostResDto(postEntity);
  }

  async createSinglePost(
    createPost: CreatePostDto,
    userId: number,
  ): Promise<PostResDto> {
    const { descriptors, ...postData } = createPost;

    const isExistedPost = await this.postRepository.findOne({
      where: {
        fullName: postData.fullName,
        dateOfBirth: DateService.getOnlyDate(postData.dateOfBirth),
        gender: postData.gender,
        missingRegion: postData.missingAddress?.region,
        hometownRegion: postData.hometown?.region,
        hometownCommune: postData.hometown?.commune,
        hometownHamlet: postData.hometown?.commune,
        hometownState: postData.hometown?.state,
      },
      relations: {
        user: true,
      },
    });
    if (isExistedPost) {
      throw new PostExistedException(
        new PostResDto(isExistedPost),
        'Post information is existed',
      );
    }

    const newPost = this.postRepository.create({
      ...new PostDBDto(postData),
      userId,
    });
    const postCreated = await this.postRepository.save(newPost);
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
    return new PostResDto(postEntity);
  }

  async updatePost(
    id: string,
    dataUpdated: UpdatePostDto,
  ): Promise<PostResDto> {
    const currentPost = await this.postRepository.findOne({
      where: {
        id: id as unknown as number,
      },
    });
    if (!currentPost) {
      throw new PostNotFoundException();
    }
    const { photos: newPhotos = [] } = dataUpdated;
    const oldPhotos = currentPost.photos?.split(',') || [];
    const photosUpdated = [...new Set([...oldPhotos, ...newPhotos])];
    const newData = this.postRepository.merge({
      ...currentPost,
      photos: photosUpdated.join(','),
    });
    const { descriptors } = dataUpdated;
    const [postUpdated] = await Promise.all([
      this.postRepository.save(newData),
      this.firebase.updateDescriptors(id, photosUpdated, descriptors),
    ]);
    return new PostResDto(postUpdated);
  }

  async deletePost(id: Uuid): Promise<ResponseSuccessDto> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id });

    const postData = await queryBuilder.getOne();
    if (!postData) {
      throw new PostNotFoundException();
    }
    const [postRemoved] = await Promise.all([
      this.postRepository.remove(postData),
      this.firebase.deleteDescriptors(id),
    ]);

    return new ResponseSuccessDto('Delete post success', postRemoved);
  }

  async getPostRelevant(id: number): Promise<PostResDto[]> {
    const postData = await this.postRepository.findOne({
      where: { id },
    });
    if (!postData) {
      throw new PostNotFoundException();
    }
    const { relevantPosts } = postData;
    if (!relevantPosts) {
      return [];
    }
    const posts = await this.postRepository.find({
      where: {
        relevantPosts: In<string>(relevantPosts.split(',')),
      },
    });

    return posts.map(post => new PostResDto(post));
  }
}
