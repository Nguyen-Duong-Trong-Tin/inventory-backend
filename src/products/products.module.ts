import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductTypesModule } from 'src/product-types/product-types.module';


@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema },
      ]),

      ProductTypesModule
    ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
