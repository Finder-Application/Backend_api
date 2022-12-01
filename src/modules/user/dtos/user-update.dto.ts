import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  middleName: string | null;

  @ApiPropertyOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  gender: boolean;

  @IsString()
  @ApiProperty()
  avatar: string | null;

  @ApiPropertyOptional()
  @IsString()
  social: string | null;

  @IsString()
  @ApiPropertyOptional()
  phone: string | null;

  @ApiPropertyOptional()
  @IsString()
  address: string | null;

  @ApiPropertyOptional()
  @IsEmail()
  email: string | null;
}
