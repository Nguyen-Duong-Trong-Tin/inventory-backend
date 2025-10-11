import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Number, required: true })
  unit: number;

  @Prop({ type: String, required: true })
  productTypeId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
