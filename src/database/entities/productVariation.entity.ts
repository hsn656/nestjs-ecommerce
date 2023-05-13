import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Color } from './color.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity()
export class ProductVariation {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  public product: Product;

  @Column({ type: 'int' })
  public productId: number;

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'sizeCode' })
  public size: Size;

  @Column({ type: 'varchar', length: 7 })
  public sizeCode: string;

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'colorName' })
  public color: Color;

  @Column({ type: 'varchar', length: 30 })
  public colorName: string;

  @Column({ type: 'text', array: true, default: [] })
  public imageUrls: string[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
