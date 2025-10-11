import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductTypeDocument = HydratedDocument<ProductType>;

@Schema({
  collection: 'product-types',
  timestamps: true,
})
export class ProductType {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductType);
