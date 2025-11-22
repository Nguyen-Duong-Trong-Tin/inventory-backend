import { forwardRef, Module } from '@nestjs/common';
import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { WarehouseReceiptsController } from './warehouse-receipts.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { WarehouseReceiptSchema } from './schema/warehousereceipts.schema';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { RolesModule } from 'src/roles/roles.module';
import { LotsModule } from 'src/lots/lots.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductTypesModule } from 'src/product-types/product-types.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WarehouseReceipt', schema: WarehouseReceiptSchema },
    ]),
    forwardRef(() => LotsModule), // nếu có vòng lặp
    SuppliersModule,
    EmployeesModule,
    WarehousesModule,
    RolesModule,
    ProductsModule,
    ProductTypesModule,
  ],
  controllers: [WarehouseReceiptsController],
  providers: [WarehouseReceiptsService],
  exports: [WarehouseReceiptsService], // ✅ PHẢI có dòng này
})
export class WarehouseReceiptsModule {}
