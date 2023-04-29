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
import { Country } from './country.entity';
import { Currency } from './currency.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  public product: Product;

  @Column({ type: 'int' })
  public productId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryCode' })
  public country: Country;

  @Column({ type: 'varchar', length: 7 })
  public countryCode: string;

  @Column({ type: 'varchar' })
  public variationType: string;

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

  @Column({ type: 'int' })
  public quantity: number;

  @Column({ type: 'float' })
  public price: number;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currencyCode' })
  public currency: Currency;

  @Column({ type: 'varchar', length: 7 })
  public currencyCode: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

export enum VariationTypes {
  NONE = 'NONE',
  OnlySize = 'OnlySize',
  OnlyColor = 'OnlyColor',
  SizeAndColor = 'SizeAndColor',
}
