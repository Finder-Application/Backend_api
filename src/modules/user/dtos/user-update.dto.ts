import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  middleName: string | null;

  @ApiPropertyOptional()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  isActive: boolean;

  @ApiPropertyOptional()
  @IsNotEmpty()
  gender: boolean;

  @IsNotEmpty()
  @ApiProperty()
  avatar: string | null;

  @ApiPropertyOptional()
  @IsNotEmpty()
  social: string | null;

  @IsNotEmpty()
  @ApiPropertyOptional()
  phone: string | null;

  @ApiPropertyOptional()
  @IsNotEmpty()
  address: string | null;

  @ApiPropertyOptional()
  @IsNotEmpty()
  email: string | null;
}
