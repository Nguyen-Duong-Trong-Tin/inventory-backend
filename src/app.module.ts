import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { RolesModule } from './roles/roles.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { EmployeesModule } from './employees/employees.module';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://tinht5667:0zp98Y7TaQ88jcBS@cluster0.sgcqdmm.mongodb.net/inventory?retryWrites=true&w=majority',
    ),
    SuppliersModule,
    ProductTypesModule,
    ProductsModule,
    CustomersModule,
    RolesModule,
    WarehousesModule,
    EmployeesModule,
    DeliveryNotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
