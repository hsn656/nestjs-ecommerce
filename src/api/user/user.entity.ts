import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  @VersionColumn()
  version: number;
}
