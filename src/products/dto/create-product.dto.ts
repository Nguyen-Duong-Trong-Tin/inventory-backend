import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  unit: number;

  @IsString()
  @IsNotEmpty()
  productTypeId: string;
}
