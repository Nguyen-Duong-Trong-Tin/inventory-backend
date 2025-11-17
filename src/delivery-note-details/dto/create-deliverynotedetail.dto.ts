import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateDeliveryNoteDetailDto {
  @IsString()
  @IsNotEmpty()
  deliveryNoteId: string;

  @IsString()
  @IsNotEmpty()
  lotId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  exportPrice: number;

  // Nếu lineNo được sinh tự động trong service thì có thể bỏ qua trường này
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  lineNo: number;
}
