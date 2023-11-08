import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IAuthUser } from '@/infra/auth/jwt.strategy';

export const AuthUser = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as IAuthUser;
  },
);
