import { isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseReceiptBodyDto {
  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  receiptNo: string;

  @IsString()
  @IsNotEmpty()
  supplierTypeId: string;

  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;
}
