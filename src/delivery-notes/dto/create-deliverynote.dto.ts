import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryNoteBodyDto {
  @IsString()
  @IsNotEmpty()
  deliveryNo: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
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
