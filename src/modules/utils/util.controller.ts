import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GeneratorService } from 'shared/services/generator.service';
import { ResponseUploadImg } from './dtos/util.dto';

@ApiTags('Utils Api')
@Controller('public/util')
export class UtilController {
  supabase: SupabaseClient;
  constructor(private generator: GeneratorService) {
    this.supabase = createClient(
      'https://lpjnwwwaudyfrenfrwgy.supabase.co',
      // eslint-disable-next-line max-len
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwam53d3dhdWR5ZnJlbmZyd2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MjMwMjQzNywiZXhwIjoxOTc3ODc4NDM3fQ.6sr-mTsFc4xFfAbbFX-siNWDNCbunVAagcxPZFOYsGE',
    );
  }

  @Post('upload-multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOkResponse({ type: ResponseUploadImg })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFile('files') files: Express.Multer.File[]) {
    const listUpload: Array<Promise<any>> = [];
    for (const file of files) {
      if (file.mimetype.split('/')[0] === 'image') {
        listUpload.push(
          this.supabase.storage
            .from('images')
            .upload(`img-${this.generator.uuid()}`, file.buffer , {
              cacheControl: '3600',
              upsert: true,
              contentType: file.mimetype,
            }),
        );
      }
    }

    const result = await Promise.all(listUpload);

    return {
      images: result
        .filter(item => !item.error)
        .map(
          e =>
            `https://lpjnwwwaudyfrenfrwgy.supabase.co/storage/v1/object/public/images/${e.data.path}`,
        ),
    };
  }
}
