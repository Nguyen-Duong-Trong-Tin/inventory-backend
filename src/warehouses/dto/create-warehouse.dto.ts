import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
