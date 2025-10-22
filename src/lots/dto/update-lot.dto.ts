import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLotsBodyDto {
  @IsNumber()
  @IsOptional()
  lotNumber?: number;

  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  warehouseReceiptId?: string;

}