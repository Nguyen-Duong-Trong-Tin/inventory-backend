import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductTypesDocument = HydratedDocument<ProductTypes>;

@Schema({
  collection: 'product-types',
  timestamps: true,
})
export class ProductTypes {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;
}

export const ProductTypeSchema = SchemaFactory.createForClass(ProductTypes);
