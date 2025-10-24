import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WarehouseDocument = HydratedDocument<WarehouseReceipt>;

@Schema({
  collection: 'warehousereceipts',
  timestamps: true,
})
export class WarehouseReceipt {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  receiptNo: string;

  @Prop({ type: String, required: true })
  supplierId: string;

  @Prop({ type: String, required: true })
  warehouseId: string;

  @Prop({ type: Number, required: true })
  employeeId: string;
}

export const WarehouseReceiptSchema =
  SchemaFactory.createForClass(WarehouseReceipt);
