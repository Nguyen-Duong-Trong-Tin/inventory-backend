import { IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
