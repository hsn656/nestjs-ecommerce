import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleDto {
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @IsNumber()
  @IsNotEmpty()
  public roleId: number;
}
