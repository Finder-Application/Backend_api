import { Injectable } from '@nestjs/common';
import { generate } from 'generate-password';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }

  public genPw(): string {
    return generate({
      length: 10,
      numbers: true,
    });
  }

  public genOtp(): string {
    // eslint-disable-next-line unicorn/numeric-separators-style
    return String(Math.floor(100000 + Math.random() * 900000));
  }
}
