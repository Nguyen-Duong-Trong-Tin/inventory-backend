import { Module } from '@nestjs/common';

import { LotsModule } from 'src/lots/lots.module';
import { ProductsModule } from 'src/products/products.module';
import { CustomersModule } from 'src/customers/customers.module';
import { DeliveryNotesModule } from 'src/delivery-notes/delivery-notes.module';
import { DeliveryNoteDetailsModule } from 'src/delivery-note-details/delivery-note-details.module';

import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { WeightsModule } from 'src/weights/weights.module';

@Module({
  imports: [
    LotsModule,
    WeightsModule,
    ProductsModule,
    CustomersModule,
    DeliveryNotesModule,
    DeliveryNoteDetailsModule,
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
})
export class SuggestionsModule {}
