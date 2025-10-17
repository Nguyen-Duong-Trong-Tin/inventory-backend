import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTypeBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
