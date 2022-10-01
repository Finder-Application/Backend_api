import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dto/abstract.dto';

export class NotificationDto extends AbstractDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  contents: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class CountNotificationDto {
  @ApiProperty()
  count: number;
}
