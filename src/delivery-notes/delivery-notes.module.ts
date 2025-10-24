import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { DeliveryNote, DeliveryNoteSchema } from './schema/deliverynote.schema';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryNote.name, schema: DeliveryNoteSchema },
    ]),

    WarehousesModule,
    EmployeesModule,
    CustomersModule,
  ],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
  exports: [DeliveryNotesService],
})
export class DeliveryNotesModule {}
