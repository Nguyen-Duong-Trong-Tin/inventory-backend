import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteBodyDto, CreateDeliverynoteBodyDto } from './dto/create-deliverynote.dto';
import { UpdateDeliveryNoteBodyDto } from './dto/update-deliverynote.dto';
import { FindDeliveryNotesQueryDto } from './dto/find-deliverynotes.dto';

@Controller({
  path: 'delivery-notes',
  version: '1',
})
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) { }

  @Post('/')
  async createDeliveryNote(@Body() body: CreateDeliveryNoteBodyDto) {
    return this.deliveryNotesService.createDeliveryNote({ body });
  }

  @Patch('/:id')
  async updateDeliveryNote(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryNoteBodyDto,
  ) {
    return this.deliveryNotesService.updateDeliveryNote({ id, body });
  }

  @Delete('/:id')
  async deleteDeliveryNote(@Param('id') id: string) {
    return this.deliveryNotesService.deletedeliverynote({ id });
  }

  @Get('/')
  async findDeliveryNotes(@Query() query: FindDeliveryNotesQueryDto) {
    return this.deliveryNotesService.findDeliveryNotes({ query });
  }

  @Get('/:id')
  async findDeliveryNoteById(@Param('id') id: string) {
    return this.deliveryNotesService.findOne({ filter: { _id: id } });
  }
}
