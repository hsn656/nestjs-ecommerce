import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SucessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          isSuccess: true,
          message: 'success',
          data,
          errorCode: null,
          errors: [],
        };
      }),
    );
  }
}

export const successObject = {
  message: 'success',
};
