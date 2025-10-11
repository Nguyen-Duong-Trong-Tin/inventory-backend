import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://tinht5667:0zp98Y7TaQ88jcBS@cluster0.sgcqdmm.mongodb.net/inventory?retryWrites=true&w=majority',
    ),
    SuppliersModule,
    ProductTypesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
