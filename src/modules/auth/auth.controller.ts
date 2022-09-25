import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';

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

  @Post('forgot-pw')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userForgotPw(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.login(userLoginDto);
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
