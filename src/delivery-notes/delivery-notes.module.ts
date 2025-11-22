import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { DeliveryNote, DeliveryNoteSchema } from './schema/deliverynote.schema';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { CustomersModule } from 'src/customers/customers.module';
import { RolesModule } from 'src/roles/roles.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductTypesModule } from 'src/product-types/product-types.module';
import { LotsModule } from 'src/lots/lots.module';
import { DeliveryNoteDetailsModule } from 'src/delivery-note-details/delivery-note-details.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryNote.name, schema: DeliveryNoteSchema },
    ]),

    WarehousesModule,
    EmployeesModule,
    CustomersModule,
    RolesModule,
    ProductsModule,
    ProductTypesModule,
    LotsModule,
    forwardRef(() => DeliveryNoteDetailsModule),
  ],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
  exports: [DeliveryNotesService],
})
export class DeliveryNotesModule {}
