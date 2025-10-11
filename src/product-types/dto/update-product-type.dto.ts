import { IsOptional, IsString } from 'class-validator';

export class UpdateProductTypeBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
