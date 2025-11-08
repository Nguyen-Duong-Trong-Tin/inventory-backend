import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWarehouseReceiptBodyDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  receiptNo?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  supplierId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  warehouseId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  employeeId?: string;
}