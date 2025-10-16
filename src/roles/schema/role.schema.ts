import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  collection: 'roles',
  timestamps: true,
})
export class Role {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [String], default: [] })
  permisstion: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
