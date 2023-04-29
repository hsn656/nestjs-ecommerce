import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
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

  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class FindOneParams {
  @IsNumberString()
  id: number;
}
