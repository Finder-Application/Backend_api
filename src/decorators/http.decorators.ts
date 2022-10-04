import {
  applyDecorators,
  createParamDecorator,
  Param,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common';
import type { ExecutionContext, Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Session } from 'inspector';

import { PublicRoute } from './public-route.decorator';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
export function Auth(options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
