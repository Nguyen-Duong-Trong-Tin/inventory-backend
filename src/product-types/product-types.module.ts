import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { ProductTypes, ProductTypeSchema } from './schema/product-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductTypes.name, schema: ProductTypeSchema },
    ]),
  ],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  exports: [ProductTypesService]
})
export class ProductTypesModule {}
