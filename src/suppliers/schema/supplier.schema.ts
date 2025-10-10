import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({
  collection: 'suppliers',
  timestamps: true,
})
export class Supplier {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  address: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
