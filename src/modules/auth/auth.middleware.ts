import {
  ForbiddenException,
  Global,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { RequestCustom } from 'interfaces/request';
import { ApiConfigService } from 'shared/services/api-config.service';
import { AuthService } from './auth.service';

@Global()
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private configService: ApiConfigService,
  ) {}

  use(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      let decode: RequestCustom['session'];
      if (this.configService.isDevelopment) {
        decode = {
          userName: 'taccin03@gmail.com',
          uuid: '90e778d0-3c81-11ed-9c12-d93050488a69',
          userId: 1,
        };
      } else {
        let authHeader: string;
        try {
          authHeader = (req.headers.authorization || '').split('Bearer ')[1];
        } catch {
          throw new UnauthorizedException(
            'Signature verification raised: Authorization header is missing or malformed',
          );
        }

        decode = this.authService.validateJwt(authHeader);
      }
      req.session = {
        ...decode,
      };
    } catch (error) {
      throw new ForbiddenException(`Signature verification raised: ${error}`);
    }

    next();
  }
}
