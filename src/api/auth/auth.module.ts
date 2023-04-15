import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [],
})
export class AuthModule {}
