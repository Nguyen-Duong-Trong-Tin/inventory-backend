import { Module } from '@nestjs/common';
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { WarehouseReceiptsController } from './warehouse-receipts.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseReceiptSchema } from './schema/warehousereceipts.schema';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WarehouseReceipt', schema: WarehouseReceiptSchema },
    ]),
    SuppliersModule,
    EmployeesModule,
    WarehousesModule,
    RolesModule,
  ],
  controllers: [WarehouseReceiptsController],
  providers: [WarehouseReceiptsService],
  exports: [WarehouseReceiptsService],
})
export class WarehouseReceiptsModule {}
