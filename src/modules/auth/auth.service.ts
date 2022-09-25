import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from 'database/entities/Accounts';
import { UserDto } from 'modules/user/dtos/user.dto';
import { GeneratorService } from 'shared/services/generator.service';
import { Repository } from 'typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    @InjectRepository(Accounts)
    private accountsRepository: Repository<Accounts>,
    private generatorUuid: GeneratorService,
  ) {}

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
        password: userLoginDto.password,
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

    throw new NotFoundException('Your user name or password is invalid!');
  }

  loginByGoogle() {
    return 'loginByGoogle';
  }

  //   async register() {}

  registerByGoogle() {
    return 'registerByGoogle';
  }

  validateJwt(token: string) {
    return this.jwtService.verify(token);
  }
}
