import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from 'database/entities/Accounts';
import { Users } from 'database/entities/Users';
import { ServerError } from 'exceptions/server-errror.exceptions';
import { LoginPayloadDto } from 'modules/auth/dto/LoginPayloadDto';
import { TokenPayloadDto } from 'modules/auth/dto/TokenPayloadDto';
import { NotFoundError } from 'rxjs';
import { ApiConfigService } from 'shared/services/api-config.service';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { ValidatorService } from '../../shared/services/validator.service';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
    private configService: ApiConfigService,
    private validator: ValidatorService,
    private jwtService: JwtService,
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
      return await this.userRepository.save({
        id: user_id,
        ...dataUpdate,
      });
    } catch (error) {
      console.error(
        '🚀 ~ file: user.service.ts ~ line 59 ~ UserService ~ update ~ error',
        error,
      );
      throw new ServerError();
    }
  }

  async createAccessToken(data: {
    userName: string;
    uuid: string;
    userId: number;
    lastName: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userName: data.userName,
        uuid: data.uuid,
        userId: data.userId,
        lastName: data.lastName,
      }),
    });
  }

  async changePw(uuid: string, password: string, oldPassword: string) {
    const account = await this.accountsRepository.findOne({
      where: {
        uuid,
      },
    });

    if (account && this.validator.comparePw(account.password, oldPassword)) {
      await this.accountsRepository
        .createQueryBuilder()
        .update(Accounts)
        .set({ password: this.validator.encryptionPassword(password) })
        .where('uuid = :uuid', { uuid })
        .execute();

      const [accountReturn] = await Promise.all([
        this.accountsRepository.findOne({
          where: {
            uuid,
          },
          relations: {
            users: true,
          },
        }),
      ]);

      if (accountReturn) {
        const token = await this.createAccessToken({
          userName: accountReturn.userName,
          uuid: accountReturn.uuid,
          userId: accountReturn.users[0].id,
          lastName: accountReturn.users[0].lastName,
        });

        return new LoginPayloadDto(new UserDto(accountReturn.users[0]), token);
      }
      throw new InternalServerErrorException('Change password failed');
    }

    throw new NotFoundException('Your old password is invalid!');
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
