import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadDto } from '../dto/auth.dto';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): PayloadDto => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
