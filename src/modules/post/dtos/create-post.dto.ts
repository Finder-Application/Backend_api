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
  region: string | null;
  state: string | null;
  commune: string | null;
  hamlet: string | null;
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

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  gender: boolean | null;

  @ApiPropertyOptional({ type: Address })
  @IsOptional()
  hometown?: Address;

  @ApiPropertyOptional({ type: Address })
  @IsOptional()
  missingAddress?: Address;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsString()
  missingTime?: Date | null;

  @ApiPropertyOptional({ type: Array<string> })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  description: string | null;

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
