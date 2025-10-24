import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseReceiptBodyDto {
  @IsString()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  receiptNo?: string;

  @IsString()
  @IsNotEmpty()
  supplierId?: string;

  @IsString()
  @IsNotEmpty()
  warehouseId?: string;

  @IsString()
  @IsNotEmpty()
  employeeId?: string;
}
