import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { DeliveryNoteDetail, DeliveryNoteDetailSchema } from './schema/deliverynotedetail.schema';

import { LotsModule } from 'src/lots/lots.module';
import { DeliveryNotesModule } from 'src/delivery-notes/delivery-notes.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { RolesModule } from 'src/roles/roles.module';
import { DeliveryNoteDetailsController } from './delivery-note-details.controller';
import { DeliveryNoteDetailsService } from './delivery-note-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryNoteDetail.name, schema: DeliveryNoteDetailSchema },
    ]),
    LotsModule,
    DeliveryNotesModule,
    EmployeesModule,
    RolesModule,
  ],
  controllers: [DeliveryNoteDetailsController],
  providers: [DeliveryNoteDetailsService],
  exports: [DeliveryNoteDetailsService],
})
export class DeliveryNoteDetailsModule {}