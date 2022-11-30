import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'database/entities/Users';
import { ServerError } from 'exceptions/server-errror.exceptions';
import { NotFoundError } from 'rxjs';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private validatorService: ValidatorService,
    private commandBus: CommandBus,
  ) {}

  //   /**
  //    * Find single user
  //    */
  async findOne(findData: FindOptionsWhere<Users>): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: findData.id,
      },
      relations: ['account'],
    });

    if (user) {
      return new UserDto(user);
    }
    throw new NotFoundError('User invalid');
  }

  async update(user_id: number, dataUpdate: Partial<Users>) {
    try {
      const user = await this.userRepository.save({
        id: user_id,
        ...dataUpdate,
      });
      return user;
    } catch (error) {
      console.error(
        '🚀 ~ file: user.service.ts ~ line 59 ~ UserService ~ update ~ error',
        error,
      );
      throw new ServerError();
    }
  }
  //   async findByUsernameOrEmail(
  //     options: Partial<{ username: string; email: string }>,
  //   ): Promise<UserEntity | null> {
  //     const queryBuilder = this.userRepository
  //       .createQueryBuilder('user')
  //       .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');
  //     if (options.email) {
  //       queryBuilder.orWhere('user.email = :email', {
  //         email: options.email,
  //       });
  //     }
  //     if (options.username) {
  //       queryBuilder.orWhere('user.username = :username', {
  //         username: options.username,
  //       });
  //     }
  //     return queryBuilder.getOne();
  //   }
  //   @Transactional()
  //   async createUser(
  //     userRegisterDto: UserRegisterDto,
  //     file?: IFile,
  //   ): Promise<UserEntity> {
  //     const user = this.userRepository.create(userRegisterDto);
  //     if (file && !this.validatorService.isImage(file.mimetype)) {
  //       throw new FileNotImageException();
  //     }
  //     if (file) {
  //       //   user.avatar = await upload img
  //     }
  //     await this.userRepository.save(user);
  //     user.settings = await this.createSettings(
  //       user.id,
  //       plainToClass(CreateSettingsDto, {
  //         isEmailVerified: false,
  //         isPhoneVerified: false,
  //       }),
  //     );
  //     return user;
  //   }
  //   async getUsers(
  //     pageOptionsDto: UsersPageOptionsDto,
  //   ): Promise<PageDto<UserDto>> {
  //     const queryBuilder = this.userRepository.createQueryBuilder('user');
  //     const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
  //     return items.toPageDto(pageMetaDto);
  //   }
  //   async getUser(userId: Uuid): Promise<UserDto> {
  //     const queryBuilder = this.userRepository.createQueryBuilder('user');
  //     queryBuilder.where('user.id = :userId', { userId });
  //     const userEntity = await queryBuilder.getOne();
  //     if (!userEntity) {
  //       throw new UserNotFoundException();
  //     }
  //     return userEntity.toDto();
  //   }
  //   async createSettings(
  //     userId: Uuid,
  //     createSettingsDto: CreateSettingsDto,
  //   ): Promise<UserSettingsEntity> {
  //     return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
  //       new CreateSettingsCommand(userId, createSettingsDto),
  //     );
  //   }
}
