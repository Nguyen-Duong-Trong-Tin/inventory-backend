import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeliverynoteDocument = HydratedDocument<Deliverynote>;

@Schema({
  collection: 'deliverynotes',
  timestamps: true,
})
export class Deliverynote {
  @Prop({ type: String, required: true })
  deliveryNo: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  warehouseId: string;

  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: true })
  customerId: string;
}

export const DeliverynoteSchema = SchemaFactory.createForClass(Deliverynote);
