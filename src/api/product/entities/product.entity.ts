import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { productDetails } from '../product.types';
import { Category } from './category.entity';

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

  @ManyToOne(() => User, (user) => user.products)
  public merchant: User;

  @ManyToOne(() => Category, (category) => category.products)
  public category: Category;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
