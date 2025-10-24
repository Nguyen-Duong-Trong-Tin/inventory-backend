import { IsOptional, IsString } from 'class-validator';

export class UpdateProductTypesBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
