import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LotDocument = HydratedDocument<Lot>;

@Schema({
  collection: 'lots',
  timestamps: true,
})
export class Lot {
  @Prop({ type: Number, required: true })
  lotNumber: number;

  @Prop({ type: Date, required: true })
  manufactureDate: Date;

  @Prop({ type: Date, required: true })
  expiryDate: Date;

  @Prop({ type: String, required: true })
  warehouseReceiptId: string;

  @Prop({ type: String, required: true })
  productId: string;
}

export const LotSchema = SchemaFactory.createForClass(Lot);
