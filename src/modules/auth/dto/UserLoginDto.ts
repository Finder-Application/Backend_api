import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}

export class UserForgotPwDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
  }
