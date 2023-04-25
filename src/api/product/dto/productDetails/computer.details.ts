import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Categories } from 'src/database/entities/category.entity';

export class ComputerDetails {
  @IsString()
  @IsNotEmpty()
  category = Categories.Computers;

  @IsNumber()
  capacity: number;

  @IsString()
  @IsIn(['GB', 'TB'])
  capacityUnit: 'GB' | 'TB';

  @IsString()
  @IsIn(['SSD', 'HD'])
  capacityType: 'SSD' | 'HD';

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  series: string;
}
