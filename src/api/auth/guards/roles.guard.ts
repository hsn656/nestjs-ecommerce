import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { errorMessages } from 'src/shared/errors';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/api/user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roleIds', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findById(request.user.id, {
      roles: true,
    });
    if (user.roles.some((userRole) => roles.includes(userRole.id))) return true;
    else throw new UnauthorizedException(errorMessages.auth.notAllowed.en);
  }
}
