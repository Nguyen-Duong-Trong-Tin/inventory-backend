import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './schema/lot.schema';
import { WarehouseReceiptsModule } from 'src/warehouse-receipts/warehouse-receipts.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
        MongooseModule.forFeature([
          { name: Lot.name, schema: LotSchema },
        ]),
        WarehouseReceiptsModule,
        ProductsModule,
      ],
    controllers: [LotsController],
    providers: [LotsService],
    exports: [LotsService]
})
export class LotsModule {}
