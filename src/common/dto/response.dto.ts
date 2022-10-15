import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseSuccessDto {
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  record?: any;
  constructor(message?: string, data?: any) {
    this.message = message || 'success';
    this.record = data;
  }
}
