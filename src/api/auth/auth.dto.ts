import { IsNotEmpty } from 'class-validator';

export class PayloadDto {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public id: number;
}
