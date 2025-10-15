import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class Customer {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  phone: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
