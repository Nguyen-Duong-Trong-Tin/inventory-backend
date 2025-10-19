import { Module } from '@nestjs/common';
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { WarehouseReceiptsController } from './warehouse-receipts.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseReceiptSchema } from './schema/warehousereceipts.schema';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { Employee } from 'src/employees/schema/employee.schema';
import { EmployeesModule } from 'src/employees/employees.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WarehouseReceipt', schema: WarehouseReceiptSchema },
    ]),
    SuppliersModule,
    EmployeesModule,
    WarehousesModule,
  ],
  controllers: [WarehouseReceiptsController],
  providers: [WarehouseReceiptsService],
})
export class WarehouseReceiptsModule {}
