import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Comments } from 'database/entities/Comments';
import { SubComments } from 'database/entities/SubComments';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

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

export class CommentIdDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class SubCommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  repFor: number | null;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  photo: string | null;

  @ApiProperty()
  content: string;

  @ApiProperty()
  likes: number;

  @ApiProperty({ type: () => UserPublicDto })
  user: UserPublicDto;

  constructor(comment: SubComments) {
    this.id = comment.id;
    this.repFor = comment.subFor;
    this.postId = comment.postId;
    this.photo = comment.photo;
    this.content = comment.content;
    this.likes = comment.likes;
    this.user = new UserPublicDto(comment.user);
  }
}

export class CommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  photo: string | null;

  @ApiProperty()
  content: string;

  @ApiProperty()
  likes: number;

  @ApiProperty({ type: () => UserPublicDto })
  user: UserPublicDto;

  @ApiPropertyOptional({ type: () => [SubCommentDto] })
  child?: SubCommentDto[];

  constructor(comment: Comments) {
    this.id = comment.id;
    this.postId = comment.postId;
    this.photo = comment.photo;
    this.content = comment.content;
    this.likes = comment.likes;
    this.user = new UserPublicDto(comment.user);
    this.child = comment.subComments.map(
      (e: SubComments) => new SubCommentDto(e),
    );
  }
}
