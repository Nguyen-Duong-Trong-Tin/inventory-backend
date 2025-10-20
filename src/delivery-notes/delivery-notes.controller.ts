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
import { CreateDeliverynoteBodyDto } from './dto/create-deliverynote.dto';

@Controller({
  path: 'delivery-notes',
  version: '1',
})
export class DeliveryNotesController {
  constructor(private readonly deliveryNotesService: DeliveryNotesService) {}

  @Post('/')
  async createDeliverynote(@Body() body: CreateDeliverynoteBodyDto){
    return this.deliveryNotesService.createDeliverynote({ body });
  }
}
