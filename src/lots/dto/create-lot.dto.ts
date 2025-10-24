import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLotBodyDto {
  @IsNumber()
  @IsNotEmpty()
  lotNumber: number;

  @IsDateString()
  @IsNotEmpty()
  manufactureDate: string;

  @IsDateString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  warehouseReceiptId: string;
}
