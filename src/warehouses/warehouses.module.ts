import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { Warehouse, WarehouseSchema } from './schema/warehouse.schema';
import { EmployeesModule } from 'src/employees/employees.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warehouse.name, schema: WarehouseSchema },
    ]),

    EmployeesModule,
    RolesModule,
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
