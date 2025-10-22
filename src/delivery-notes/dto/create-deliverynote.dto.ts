import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDeliveryNoteBodyDto {
  @IsString()
  @IsNotEmpty()
  deliveryNo: string;

  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;
}
