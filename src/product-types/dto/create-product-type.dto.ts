import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTypesBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
