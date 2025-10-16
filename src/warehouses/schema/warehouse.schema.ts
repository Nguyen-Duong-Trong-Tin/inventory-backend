import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WarehouseDocument = HydratedDocument<Warehouse>;

@Schema({
  collection: 'warehouses',
  timestamps: true,
})
export class Warehouse {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
