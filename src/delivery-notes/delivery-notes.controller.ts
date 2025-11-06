import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteBodyDto } from './dto/create-deliverynote.dto';
import { UpdateDeliveryNoteBodyDto } from './dto/update-deliverynote.dto';
import { FindDeliveryNotesQueryDto } from './dto/find-deliverynotes.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'delivery-notes',
  version: '1',
})
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createDeliveryNote(@Body() body: CreateDeliveryNoteBodyDto) {
    return this.deliveryNotesService.createDeliveryNote({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateDeliveryNote(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryNoteBodyDto,
  ) {
    return this.deliveryNotesService.updateDeliveryNote({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDeliveryNote(@Param('id') id: string) {
    return this.deliveryNotesService.deletedeliverynote({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNotes(@Query() query: FindDeliveryNotesQueryDto) {
    return this.deliveryNotesService.findDeliveryNotes({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNoteById(@Param('id') id: string) {
    return this.deliveryNotesService.findOne({ filter: { _id: id } });
  }
}
