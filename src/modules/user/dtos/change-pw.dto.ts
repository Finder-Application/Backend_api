import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePwPayloadDto {
  @IsString()
  @ApiProperty()
  pw: string;

  @IsString()
  @ApiProperty()
  oldPw: string;
}
