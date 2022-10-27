import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { Posts } from 'database/entities/Posts';
import TABLES from 'database/entities/tables';
import { FirebaseService } from 'modules/firebase/firebase.service';
import { ApiConfigService } from 'shared/services/api-config.service';
import { Repository } from 'typeorm';
import { ValidatorService } from '../../shared/services/validator.service';
import { DateService } from './../../shared/services/Date.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostConvertToDBDto } from './dtos/post-convert.dto';
import { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostConvertToResDto } from './dtos/post-res.dto';
import { ResponseUpsertPostDto } from './dtos/res-upsert.dto';
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
        new PostConvertToResDto(isExistedPost),
        'Post information is existed',
      );
    }

    const newPost = this.postRepository.create({
      ...new PostConvertToDBDto(postData),
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
    return new PostConvertToResDto(postEntity);
  }

  async updatePost(id: Uuid, data: UpdatePostDto): Promise<void> {
    const dataUpdate = new PostConvertToDBDto(data);
    const currentPost = await this.postRepository.findOne({
      where: {
        id: id as unknown as number,
      },
    });
    if (!currentPost) {
      throw new PostNotFoundException('Post Not Found');
    }

    const oldPhotos = currentPost?.photos?.split(',') || [];
    const { photos: newPhotos = [] } = data;

    // ** Remove duplicate photos
    const photos = new Set(oldPhotos.concat(newPhotos));

    const newData = this.postRepository.merge(currentPost, dataUpdate);

    await this.postRepository.save(newData);
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
