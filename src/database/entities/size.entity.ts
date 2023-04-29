import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Size {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  public code!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}

export enum SizeCodes {
  NA = 'NA',
  Small = 'S',
  Medium = 'M',
  Large = 'L',
  XLarge = 'XL',
  XXLarge = 'XXL',
}
