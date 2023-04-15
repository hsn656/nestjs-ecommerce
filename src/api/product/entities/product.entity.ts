import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { productDetails } from '../product.types';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text', array: true })
  public about: string[];

  @Column({ type: 'text', array: true })
  public imageUrls: string[];

  @Column({ type: 'jsonb' })
  public details: Partial<productDetails>;

  @ManyToMany(() => User, (user) => user.roles)
  public users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
