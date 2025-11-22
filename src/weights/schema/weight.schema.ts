import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WeightDocument = HydratedDocument<Weight>;

@Schema({
  collection: 'weights',
  timestamps: true,
})
export class Weight {
  @Prop({ type: Number, required: true })
  w1: number;

  @Prop({ type: Number, required: true })
  w2: number;

  @Prop({ type: Number, required: true })
  w3: number;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true })
  active: boolean;
}

export const WeightSchema = SchemaFactory.createForClass(Weight);
