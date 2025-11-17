import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeliverynotedetailDocument = HydratedDocument<DeliveryNoteDetail>;

@Schema({
  collection: 'deliverynotedetails',
  timestamps: true,
})
export class DeliveryNoteDetail {
  @Prop({ type: String, required: true })
  lotId: string;

  @Prop({ type: String, required: true })
  deliveryNoteId: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  exportPrice: number;

  @Prop({ type: Number, required: true })
  lineNo: number;
}

export const DeliveryNoteDetailSchema = SchemaFactory.createForClass(DeliveryNoteDetail);