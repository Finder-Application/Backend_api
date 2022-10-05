import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  postId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  repFor: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;
}

export class LikeCommentDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class CommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  repFor: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  photos: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  likes: number;
}
