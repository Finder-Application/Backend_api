import { HttpException } from '@nestjs/common';

export class ServerError extends HttpException {
  constructor() {
    super('server error', 500);
  }
}
