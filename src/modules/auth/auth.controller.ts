import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSuccessDto } from 'common/dto/response.dto';
import { AuthService } from './auth.service';

import { LoginPayloadDto } from './dto/LoginPayloadDto';
import {
  UserChangePwDto,
  UserForgotPwDto,
  UserLoginDto,
  UserLoginGGDto,
} from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('public/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.login(userLoginDto);
  }

  @Post('login-gg')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLoginGG(
    @Body() loginDto: UserLoginGGDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.loginByGoogle(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLoginRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.register(userRegisterDto);
  }

  @Get('forgot-pw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResponseSuccessDto,
    description: 'Send mail otp for user',
  })
  userForgotPw(
    @Query() forgotPw: UserForgotPwDto,
  ): Promise<ResponseSuccessDto> {
    return this.authService.forgotPw(forgotPw.email);
  }

  @Post('change-pw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  userChangePw(@Body() changePw: UserChangePwDto): Promise<LoginPayloadDto> {
    return this.authService.changePw(changePw);
  }
}
