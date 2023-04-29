import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ProductDetails,
  ProductDetailsTypeFn,
} from 'src/api/product/dto/productDetails';
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
  @IsDefined()
  @IsNumber()
  public id!: number;

  @Column({ type: 'varchar' })
  @IsDefined()
  @IsString()
  public title: string;

  @Column({ type: 'text', nullable: true })
  @IsDefined()
  @IsString()
  public description?: string | null;

  @Column({ type: 'text', array: true, default: [] })
  @ArrayMinSize(1)
  @IsString({ each: true })
  public about?: string[];

  @Column({ type: 'text', array: true, default: [] })
  public imageUrls: string[];

  @Column({ type: 'jsonb', nullable: true })
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: Partial<ProductDetails> | null;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ type: 'int', nullable: true })
  @IsDefined()
  @IsNumber()
  merchantId: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'merchantId' })
  public merchant: User;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  public category: Category;

  @Column({ type: 'int', nullable: true })
  @IsDefined()
  @IsNumber()
  categoryId: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
