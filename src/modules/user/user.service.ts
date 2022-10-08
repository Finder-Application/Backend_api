import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Accounts } from 'database/entities/Accounts';
import { Users } from 'database/entities/Users';
import { NotFoundError } from 'rxjs';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException, UserNotFoundException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { CreateSettingsDto } from './dtos/create-settings.dto';
import { UserDto } from './dtos/user.dto';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto';

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
