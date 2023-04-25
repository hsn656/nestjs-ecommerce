import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { errorMessages } from 'src/shared/errors';
import { TokenExpiredError } from 'jsonwebtoken';
import { PayloadDto } from '../dto/auth.dto';

export class ProtectedRequest extends Request {
  user: PayloadDto;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearerToken = request.headers.authorization.split(' ')[1];
      request.user = await this.jwtService.verifyAsync(bearerToken, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException(errorMessages.auth.expiredToken.en);
      throw new UnauthorizedException(errorMessages.auth.invlidToken.en);
    }
  }
}
