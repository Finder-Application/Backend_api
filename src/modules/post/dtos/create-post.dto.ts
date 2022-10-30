import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Descriptor } from './face-descriptor.dto';
export class Address {
  region?: string;
  state?: string;
  commune?: string;
  hamlet?: string;

  constructor(
    region?: string,
    state?: string,
    commune?: string,
    hamlet?: string,
  ) {
    this.region = region;
    this.state = state;
    this.commune = commune;
    this.hamlet = hamlet;
  }
}

export class CreatePostDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  gender?: boolean;

  @ApiPropertyOptional({ type: Address })
  @IsOptional()
  hometown?: Address;

  @ApiPropertyOptional({ type: Address })
  @IsOptional()
  missingAddress?: Address;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsString()
  missingTime?: string;

  @ApiPropertyOptional({ type: Array<string> })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  description: string;

  @IsOptional()
  @ApiProperty({
    example: [
      {
        id: 'xxxx',
        descriptor: 'Descriptor',
      },
    ],
  })
  descriptors?: Array<{
    descriptor: Descriptor;
    id: string;
  }>;
}
