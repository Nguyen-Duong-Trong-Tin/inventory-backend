import { Module } from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';

@Module({
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
})
export class DeliveryNotesModule {}
