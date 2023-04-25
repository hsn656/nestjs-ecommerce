import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

export enum CategoryIds {
  Computers = 1,
  Fashion,
}

export enum Categories {
  Computers = 'Computers',
  Fashion = 'Fashion',
}
