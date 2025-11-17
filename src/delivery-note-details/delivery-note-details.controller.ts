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


import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeliveryNoteDetailsService } from './delivery-note-details.service';
import { CreateDeliveryNoteDetailDto } from './dto/create-deliverynotedetail.dto';
import { UpdateDeliveryNoteDetailDto } from './dto/update-deliverynotedetail.dto';
import { FindDeliveryNoteDetailsQueryDto } from './dto/find-deliverynotedetails.dto';

@Controller({
  path: 'delivery-note-details',
  version: '1',
})
export class DeliveryNoteDetailsController {
  constructor(private readonly deliveryNoteDetailsService: DeliveryNoteDetailsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createDeliveryNoteDetail(
    @Body() body: CreateDeliveryNoteDetailDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.deliveryNoteDetailsService.createDeliveryNoteDetail({ body, employee: user });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateDeliveryNoteDetail(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryNoteDetailDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.deliveryNoteDetailsService.updateDeliveryNoteDetail({ id, body, employee: user });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDeliveryNoteDetail(
    @Param('id') id: string,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.deliveryNoteDetailsService.deleteDeliveryNoteDetail({ id, employee: user });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNoteDetails(
    @Query() query: FindDeliveryNoteDetailsQueryDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.deliveryNoteDetailsService.findDeliveryNoteDetails({ query, employee: user });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findDeliveryNoteDetailById(@Param('id') id: string) {
    return this.deliveryNoteDetailsService.findOne({ filter: { _id: id } });
  }
}