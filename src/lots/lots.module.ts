import { forwardRef, Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './schema/lot.schema';

import { WarehouseReceiptsModule } from 'src/warehouse-receipts/warehouse-receipts.module';
import { ProductsModule } from 'src/products/products.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }]),
    forwardRef(() => WarehouseReceiptsModule), // ✅ để tránh circular dependency
    ProductsModule,
    EmployeesModule,
    RolesModule,
  ],
  controllers: [LotsController],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
