import { ApiProperty } from '@nestjs/swagger';

export class UploadImg {
  @ApiProperty({ type: String, required: true, format: 'binary' })
  img?: string;
}

export class ResponseUploadImg {
  @ApiProperty({ type: [String] })
  images: string[];
}
