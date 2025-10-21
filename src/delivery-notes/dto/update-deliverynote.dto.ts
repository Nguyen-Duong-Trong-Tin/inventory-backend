import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDeliveryNoteBodyDto {
  @IsString()
  @IsOptional()
  deliveryNo?: string;

  @IsString()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsOptional()
  warehouseId: string;

  @IsString()
  @IsOptional()
  employeeId: string;

  @IsString()
  @IsOptional()
  customerId: string;
}
