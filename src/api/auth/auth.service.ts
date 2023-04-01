import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  login(): string {
    return 'login';
  }

  async register(user: CreateUserDto): Promise<User> {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser) throw new ConflictException('user already exist');

    const newUser = this.userService.createUser(user);
    return newUser;
  }
}
