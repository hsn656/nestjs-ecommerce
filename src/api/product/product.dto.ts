import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;
}

export class ProductDetailsDto {
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;
}
