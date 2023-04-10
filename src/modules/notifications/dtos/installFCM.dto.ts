import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InstallFCM {
  @ApiProperty()
  @IsString()
  readonly token: string;
}

export class PushMessages {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly body: string;
}
