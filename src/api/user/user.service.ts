import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from '../../database/entities/user.entity';
import { hash, compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { errorMessages } from 'src/shared/errors';
import { Role } from '../../database/entities/role.entity';
import { UserRelation } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  public async createUser(
    body: CreateUserDto,
    ...roles: Role[]
  ): Promise<User> {
    body.password = await hash(body.password, 10);
    const user: User = this.repository.create({
      ...body,
      roles,
    });

    return this.repository.save(user);
  }

  public async findByEmail(
    email: string,
    relations?: UserRelation,
  ): Promise<User> {
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
      relations,
    });
    return user;
  }

  public async comparePassword(password, userPassword): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async findById(id: number, relations?: UserRelation): Promise<User> {
    const user: User = await this.repository.findOne({
      where: {
        id,
      },
      relations,
    });
    if (!user) {
      throw new NotFoundException(errorMessages.user.notFound.en);
    }
    return user;
  }

  public async save(user: User) {
    return this.repository.save(user);
  }
}
