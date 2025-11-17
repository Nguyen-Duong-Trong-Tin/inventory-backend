import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsNumber, Min } from 'class-validator';

export class UpdateDeliveryNoteDetailDto {
  @IsString()
  @IsOptional()
  deliveryNoteId?: string;

  @IsString()
  @IsOptional()
  lotId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  exportPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  lineNo?: number;
}