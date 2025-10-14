import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber({}, { message: 'unit must be a number' })
  @IsOptional()
  unit?: number;

  @IsString()
  @IsOptional()
  productTypeId: string;
}
