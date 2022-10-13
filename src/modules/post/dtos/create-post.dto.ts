import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  latsName: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lostAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hometown?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  lostTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photos?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relevantPosts?: string;
}
