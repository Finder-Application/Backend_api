import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class ValidatorService {
  salt: string;
  constructor() {
    this.salt = genSaltSync(8);
  }

  public encryptionPassword(password: string): string {
    return hashSync(password, this.salt);
  }

  public comparePw(password: string, hashPw: string): boolean {
    return compareSync(hashPw, password);
  }
}
