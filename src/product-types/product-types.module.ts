import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductTypes, ProductTypeSchema } from './schema/product-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductTypes.name, schema: ProductTypeSchema },
    ]),
  ],
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
})
export class ProductTypesModule {}
