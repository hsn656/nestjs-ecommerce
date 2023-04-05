import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization.split(' ')[1];
    request.user = await this.jwtService.verifyAsync(bearerToken, {
      secret: process.env.JWT_SECRET,
    });
    return true;
  }
}
