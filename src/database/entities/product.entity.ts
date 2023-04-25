import { ProductDetails } from 'src/api/product/productDetails';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public title: string;

  @Column({ type: 'text', nullable: true })
  public description?: string | null;

  @Column({ type: 'text', array: true, default: [] })
  public about?: string[];

  @Column({ type: 'text', array: true, default: [] })
  public imageUrls: string[];

  @Column({ type: 'jsonb', nullable: true })
  public details: Partial<ProductDetails> | null;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ type: 'int', nullable: true })
  merchantId: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'merchantId' })
  public merchant: User;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  public category: Category;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
