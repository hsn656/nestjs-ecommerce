import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { User } from 'src/database/entities/user.entity';

export const generateMockToken = async (module: TestingModule, user: User) => {
  const jwtService = module.get(JwtService);
  return jwtService.signAsync(
    {
      email: user.email,
      id: user.id,
    },
    {
      secret: process.env.JWT_SECRET,
    },
  );
};
