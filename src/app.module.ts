import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://tinht5667:0zp98Y7TaQ88jcBS@cluster0.sgcqdmm.mongodb.net/inventory?retryWrites=true&w=majority',
    ),
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
