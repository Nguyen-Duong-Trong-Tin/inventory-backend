import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LotDocument = HydratedDocument<Lot>;

@Schema({
  collection: 'lots',
  timestamps: true,
})
export class Lot {
  @Prop({ type: String, required: true })
  lotNumber: string;

  @Prop({ type: Date, required: true })
  manufactureDate: Date;

  @Prop({ type: Date, required: true })
  expiryDate: Date;

  @Prop({ type: String, required: true })
  warehouseReceiptId: string;

  @Prop({ type: String, required: true })
  productId: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  importPrice: number;
}

export const LotSchema = SchemaFactory.createForClass(Lot);
