import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Country } from './country.entity';
import { Currency } from './currency.entity';
import { ProductVariation } from './productVariation.entity';

@Entity()
export class ProductVariationPrice {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => ProductVariation)
  @JoinColumn({ name: 'productVariationId' })
  public productVariation: ProductVariation;

  @Column({ type: 'int' })
  public productVariationId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryCode' })
  public country: Country;

  @Column({ type: 'varchar', length: 7 })
  public countryCode: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currencyCode' })
  public currency: Currency;

  @Column({ type: 'varchar', length: 7 })
  public currencyCode: string;

  @Column({ type: 'float' })
  public price: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
