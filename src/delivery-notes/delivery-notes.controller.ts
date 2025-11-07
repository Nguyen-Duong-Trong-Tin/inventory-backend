import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
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
  async createDeliveryNote(
    @Body() body: CreateDeliveryNoteBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.deliveryNotesService.createDeliveryNote({ body, employee: user  });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateDeliveryNote(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryNoteBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.deliveryNotesService.updateDeliveryNote({ id, body, employee: user  });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDeliveryNote(
    @Param('id') id: string,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.deliveryNotesService.deletedeliverynote({ id, employee: user  });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNotes(
    @Query() query: FindDeliveryNotesQueryDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.deliveryNotesService.findDeliveryNotes({ query, employee: user  });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNoteById(@Param('id') id: string) {
    return this.deliveryNotesService.findOne({ filter: { _id: id } });
  }
}
