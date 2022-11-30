import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  middleName: string | null;

  @ApiProperty({
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  gender: boolean;

  @IsString()
  @ApiProperty()
  avatar: string | null;

  @ApiProperty()
  @IsString()
  social: string | null;

  @IsString()
  @ApiProperty({
    required: true,
  })
  phone: string | null;

  @IsString()
  @ApiProperty({
    required: true,
  })
  address: string | null;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string | null;
}
