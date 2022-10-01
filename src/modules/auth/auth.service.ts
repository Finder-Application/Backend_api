import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from 'database/entities/Accounts';
import { Users } from 'database/entities/Users';
import { OAuth2Client } from 'google-auth-library';
import { ISocialInterface } from 'interfaces/social.interface';
import { UserDto } from 'modules/user/dtos/user.dto';
import { GeneratorService } from 'shared/services/generator.service';
import { ValidatorService } from 'shared/services/validator.service';
import { Repository } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthGoogleLoginDto, LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
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
    const user = await this.accountsRepository.findOne({
      where: {
        userName: userLoginDto.email,
      },
      relations: {
        users: true,
      },
    });

    if (
      user &&
      this.validator.comparePw(user.password, userLoginDto.password)
    ) {
      const token = await this.createAccessToken({
        userName: user.userName,
        uuid: user.uuid,
        userId: user.users[0].id,
      });

      return new LoginPayloadDto(new UserDto(user.users[0]), token);
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
        userName: userRegisterDto.email,
      },
    });

    if (findAccount) {
      throw new BadRequestException('Your account is already exited');
    }

    return this.createAccount(userRegisterDto);
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
    });

    return new LoginPayloadDto(new UserDto(newUser), token);
  }

  async handlerWithGoogle(socialInterface: ISocialInterface) {
    const { email = '', firstName = '', lastName = '' } = socialInterface;
    const user = await this.accountsRepository.findOne({
      where: {
        userName: socialInterface.email,
      },
      relations: {
        users: true,
      },
    });

    if (user) {
      const token = await this.createAccessToken({
        userName: user.userName,
        uuid: user.uuid,
        userId: user.users[0].id,
      });

      return new LoginPayloadDto(new UserDto(user.users[0]), token);
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
