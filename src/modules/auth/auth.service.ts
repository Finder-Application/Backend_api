import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { Accounts } from 'database/entities/Accounts';
import { Users } from 'database/entities/Users';
import { OAuth2Client } from 'google-auth-library';
import { ISocialInterface } from 'interfaces/social.interface';
import { MailService } from 'modules/mail/mail.service';
import { UserDto } from 'modules/user/dtos/user.dto';
import { GeneratorService } from 'shared/services/generator.service';
import { ValidatorService } from 'shared/services/validator.service';
import { Repository } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthGoogleLoginDto, LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserChangePwDto, UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Injectable()
export class AuthService {
  private google: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private generator: GeneratorService,
    private validator: ValidatorService,
    @InjectRedis() private readonly redis: Redis,
    private mailService: MailService,
  ) {
    this.google = new OAuth2Client(
      this.configService.configGoogle.clientId,
      this.configService.configGoogle.clientSecret,
    );
  }

  async createAccessToken(data: {
    userName: string;
    uuid: string;
    userId: number;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userName: data.userName,
        uuid: data.uuid,
        userId: data.userId,
      }),
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const account = await this.accountsRepository.findOne({
      where: {
        username: userLoginDto.email,
      },
      relations: {
        users: true,
      },
    });

    if (
      account &&
      this.validator.comparePw(account.password, userLoginDto.password)
    ) {
      const token = await this.createAccessToken({
        userName: account.username,
        uuid: account.uuid,
        userId: account.users[0].id,
      });

      return new LoginPayloadDto(
        new UserDto(account.users[0], account.uuid),
        token,
      );
    }

    throw new NotFoundException('Your user name or password is invalid!');
  }

  async loginByGoogle(loginDto: AuthGoogleLoginDto): Promise<LoginPayloadDto> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [this.configService.configGoogle.clientId],
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new BadRequestException('Your token google is invalid');
    }

    return this.handlerWithGoogle({
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    });
  }

  async register(userRegisterDto: UserRegisterDto): Promise<LoginPayloadDto> {
    const findAccount = await this.accountsRepository.findOne({
      where: {
        username: userRegisterDto.email,
      },
    });

    if (findAccount) {
      throw new BadRequestException('Your account is already exited');
    }

    return this.createAccount(userRegisterDto);
  }

  async forgotPw(email: string): Promise<ResponseSuccessDto> {
    const account = await this.accountsRepository.findOne({
      where: {
        username: email,
      },
    });

    if (!account) {
      throw new BadRequestException('Your email is not exited');
    }
    const key = `otp:${email}`;

    const ttlOfKey = await this.redis.ttl(key);
    if (ttlOfKey > 0) {
      throw new BadRequestException(
        `Please wait ${ttlOfKey} seconds to resend otp`,
      );
    }

    const otpCode = this.generator.genOtp();

    await Promise.all([
      this.redis.set(key, otpCode, 'EX', 60 * 3),
      this.mailService.sendCodeOtp(email, otpCode),
    ]);

    return new ResponseSuccessDto(
      'Send otp success . Please check your email to get otp code',
    );
  }

  async changePw(changePw: UserChangePwDto) {
    const { email, otp, password } = changePw;

    const key = `otp:${email}`;
    const getOtp = await this.redis.get(key);

    if (getOtp !== otp.toString()) {
      throw new BadRequestException('Your otp code is invalid');
    }

    await this.accountsRepository
      .createQueryBuilder()
      .update(Accounts)
      .set({ password: this.validator.encryptionPassword(password) })
      .where('username = :email', { email })
      .execute();

    const [account] = await Promise.all([
      this.accountsRepository.findOne({
        where: {
          username: email,
        },
        relations: {
          users: true,
        },
      }),
      this.redis.del(key),
    ]);

    if (account) {
      const token = await this.createAccessToken({
        userName: account.username,
        uuid: account.uuid,
        userId: account.users[0].id,
      });

      return new LoginPayloadDto(
        new UserDto(account.users[0], account.uuid),
        token,
      );
    }
    throw new InternalServerErrorException('Change password failed');
  }

  // tool
  validateJwt(token: string) {
    return this.jwtService.verify(token);
  }

  async createAccount(
    userRegisterDto: UserRegisterDto,
  ): Promise<LoginPayloadDto> {
    const { email, password, firstName, lastName, middleName } =
      userRegisterDto;

    const newUuid = this.generator.uuid();
    const newAccount = this.accountsRepository.create({
      password: this.validator.encryptionPassword(password),
      username: email,
      uuid: newUuid,
    });

    await this.accountsRepository.save(newAccount);

    const newUser = this.usersRepository.create({
      accountId: newAccount.id,
      firstName,
      middleName,
      lastName,
    });

    await this.usersRepository.save(newUser);

    const token = await this.createAccessToken({
      userName: newAccount.username,
      uuid: newAccount.uuid,
      userId: newUser.id,
    });

    return new LoginPayloadDto(new UserDto(newUser, newAccount.uuid), token);
  }

  async handlerWithGoogle(socialInterface: ISocialInterface) {
    const { email = '', firstName = '', lastName = '' } = socialInterface;
    const account = await this.accountsRepository.findOne({
      where: {
        username: socialInterface.email,
      },
      relations: {
        users: true,
      },
    });

    if (account) {
      const token = await this.createAccessToken({
        userName: account.username,
        uuid: account.uuid,
        userId: account.users[0].id,
      });

      return new LoginPayloadDto(
        new UserDto(account.users[0], account.uuid),
        token,
      );
    }

    return this.createAccount({
      email,
      password: this.generator.uuid(),
      firstName,
      lastName,
      middleName: '',
    });
  }
}

// throw new HttpException(
//     {
//       status: HttpStatus.BAD_REQUEST,
//       errors: {
//         message: 'Your account is already exited',
//       },
//     },
//     HttpStatus.BAD_REQUEST,
//   );
