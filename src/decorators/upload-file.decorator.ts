/* eslint-disable prettier/prettier */
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

interface IFileCustomInterface {
  type: any;
  nameFile: string;
}

export function ApiFileCustom(props: IFileCustomInterface) {
  const { type, nameFile } = props;
  return applyDecorators(
    UseInterceptors(FileInterceptor(nameFile)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type,
    }),
  );
}
