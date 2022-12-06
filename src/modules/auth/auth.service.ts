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
import { Auth, google } from 'googleapis';
import { ISocialInterface } from 'interfaces/social.interface';
import { MailService } from 'modules/mail/mail.service';
import { UserDto } from 'modules/user/dtos/user.dto';
import { GeneratorService } from 'shared/services/generator.service';
import { ValidatorService } from 'shared/services/validator.service';
import { Repository } from 'typeorm';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import {
  UserChangePwDto,
  UserLoginDto,
  UserLoginGGDto,
} from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;

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
    this.oauthClient = new google.auth.OAuth2(
      this.configService.configGoogle.clientId,
      this.configService.configGoogle.clientSecret,
    );
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

  async login(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const account = await this.accountsRepository.findOne({
      where: {
        userName: userLoginDto.email,
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
        userName: account.userName,
        uuid: account.uuid,
        userId: account.users[0].id,
        lastName: account.users[0].lastName,
      });

      return new LoginPayloadDto(new UserDto(account.users[0]), token);
    }

    throw new NotFoundException('Your user name or password is invalid!');
  }

  async loginByGoogle(loginDto: UserLoginGGDto): Promise<LoginPayloadDto> {
    const ticket = await this.oauthClient.getTokenInfo(loginDto.idToken);

    if (!ticket) {
      throw new BadRequestException('Your token google is invalid');
    }

    return this.handlerWithGoogle({
      id: ticket.sub || '',
      email: ticket.email,
      firstName: '',
      lastName: ticket.email?.split('@')[0] || '',
    });
  }

  async register(userRegisterDto: UserRegisterDto): Promise<LoginPayloadDto> {
    const findAccount = await this.accountsRepository.findOne({
      where: {
        userName: userRegisterDto.email,
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
        userName: email,
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
      .where('userName = :email', { email })
      .execute();

    const [account] = await Promise.all([
      this.accountsRepository.findOne({
        where: {
          userName: email,
        },
        relations: {
          users: true,
        },
      }),
      this.redis.del(key),
    ]);

    if (account) {
      const token = await this.createAccessToken({
        userName: account.userName,
        uuid: account.uuid,
        userId: account.users[0].id,
        lastName: account.users[0].lastName,
      });

      return new LoginPayloadDto(new UserDto(account.users[0]), token);
    }
    throw new InternalServerErrorException('Change password failed');
  }

  // tool
  validateJwt(token: string) {
    return this.jwtService.verify(token);
  }

  async createAccount(
    userRegisterDto: UserRegisterDto & { type?: 'google' },
  ): Promise<LoginPayloadDto> {
    const { email, password, firstName, lastName, middleName, type } =
      userRegisterDto;

    const newUuid = this.generator.uuid();
    const newAccount = this.accountsRepository.create({
      password: this.validator.encryptionPassword(password),
      userName: email,
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
      userName: newAccount.userName,
      uuid: newAccount.uuid,
      userId: newUser.id,
      lastName: newUser.lastName,
    });

    if (type === 'google') {
      //send mail new pw to user by mail
      await this.mailService.sendPw(email, password);
    }

    return new LoginPayloadDto(new UserDto(newUser), token);
  }

  async handlerWithGoogle(socialInterface: ISocialInterface) {
    const { email = '', firstName = '', lastName = '' } = socialInterface;
    const account = await this.accountsRepository.findOne({
      where: {
        userName: socialInterface.email,
      },
      relations: {
        users: true,
      },
    });

    if (account) {
      const token = await this.createAccessToken({
        userName: account.userName,
        uuid: account.uuid,
        userId: account.users[0].id,
        lastName: account.users[0].lastName,
      });

      return new LoginPayloadDto(new UserDto(account.users[0]), token);
    }

    return this.createAccount({
      email,
      password: this.generator.genPw(),
      firstName,
      lastName,
      middleName: '',
      type: 'google',
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
