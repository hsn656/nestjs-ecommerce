import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsFilter } from 'src/common/helper/errors/errors.filter';
import { SucessResponseInterceptor } from 'src/common/helper/sucess-response.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SucessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorsFilter,
    },
  ],
})
export class ApiModule {}
