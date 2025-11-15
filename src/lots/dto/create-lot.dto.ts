import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLotBodyDto {
  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  manufactureDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  expiryDate: Date;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  warehouseReceiptId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  importPrice: number;
}