import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Posts } from 'database/entities/Posts';
import { UserPublicDto } from 'modules/user/dtos/user.dto';

export class PostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  latsName: string;

  @ApiPropertyOptional({ type: Date })
  dateOfBirth: string | null;

  @ApiPropertyOptional()
  gender: boolean | null;

  @ApiPropertyOptional()
  lostAddress: string | null;

  @ApiPropertyOptional()
  hometown: string | null;

  @ApiPropertyOptional({ type: Date })
  lostTime: string | null;

  @ApiPropertyOptional()
  relationship: string | null;

  @ApiPropertyOptional()
  photos: string | null;

  @ApiPropertyOptional()
  relevantPosts: string | null;

  @ApiPropertyOptional()
  shareCount: number | null;

  @ApiProperty({ type: UserPublicDto })
  user: UserPublicDto;

  constructor(post: Posts) {
    this.id = post.id;
    this.firstName = post.firstName;
    this.latsName = post.latsName;
    this.dateOfBirth = post.dateOfBirth;
    this.gender = post.gender;
    this.lostAddress = post.lostAddress;
    this.hometown = post.hometown;
    this.lostTime = post.lostTime;
    this.relationship = post.relationship;
    this.photos = post.photos;
    this.relevantPosts = post.relevantPosts;
    this.shareCount = post.shareCount;
    this.user = new UserPublicDto(post.user);
  }
}
