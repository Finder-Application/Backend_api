import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

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

export class UserChangePwDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  @IsNumber()
  readonly otp: number;

  @IsString()
  @ApiProperty()
  readonly password: string;
}
