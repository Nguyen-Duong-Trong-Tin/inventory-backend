import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({
  collection: 'employees',
  timestamps: true,
})
export class Employee {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  roleId: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
