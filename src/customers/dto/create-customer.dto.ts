import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
