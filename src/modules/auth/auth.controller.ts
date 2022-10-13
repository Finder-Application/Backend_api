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
import { AuthService } from './auth.service';

import { AuthGoogleLoginDto, LoginPayloadDto } from './dto/LoginPayloadDto';
import {
  UserChangePwDto,
  UserForgotPwDto,
  UserLoginDto,
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
    @Body() loginDto: AuthGoogleLoginDto,
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
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  userForgotPw(@Query() forgotPw: UserForgotPwDto) {
    return this.authService.forgotPw(forgotPw.email);
  }

  @Get('change-pw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  userChangePw(@Query() changePw: UserChangePwDto) {
    return this.authService.changePw(changePw);
  }

  //   @Post('register')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  //   @ApiFile({ name: 'avatar' })
  //   async userRegister(
  //     @Body() userRegisterDto: UserRegisterDto,
  //     @UploadedFile() file?: IFile,
  //   ): Promise<UserDto> {
  //     const createdUser = await this.userService.createUser(
  //       userRegisterDto,
  //       file,
  //     );

  //     return createdUser.toDto({
  //       isActive: true,
  //     });
  //   }

  //   @Version('1')
  //   @Get('me')
  //   @HttpCode(HttpStatus.OK)
  //   @Auth([RoleType.USER, RoleType.ADMIN])
  //   @ApiOkResponse({ type: UserDto, description: 'current user info' })
  //   getCurrentUser(@AuthUser() user: UserEntity): UserDto {
  //     return user.toDto();
  //   }
}
