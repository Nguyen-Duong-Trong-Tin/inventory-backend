import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerBodyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
