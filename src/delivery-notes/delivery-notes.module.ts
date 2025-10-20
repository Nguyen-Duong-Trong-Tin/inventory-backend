import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { DeliveryNote, DeliveryNoteSchema } from './schema/deliverynote.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: DeliveryNote.name, schema: DeliveryNoteSchema },
      ]),
    ],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
  export: [DeliveryNotesService]
})
export class DeliveryNotesModule {}
