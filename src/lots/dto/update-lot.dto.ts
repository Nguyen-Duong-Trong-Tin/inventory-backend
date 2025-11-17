import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateLotBodyDto {
  @IsString()
  @IsOptional()
  lotNumber?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  manufactureDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiryDate?: Date;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  warehouseReceiptId?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  importPrice?: number;
}
