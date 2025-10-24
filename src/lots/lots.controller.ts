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

import { LotsService } from './lots.service';
import { CreateLotBodyDto } from './dto/create-lot.dto';
import { UpdateLotBodyDto } from './dto/update-lot.dto';
import { FindLotsQueryDto } from './dto/find-lots.dto';

@Controller({
  path: 'lots',
  version: '1',
})
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post('/')
  async createLot(@Body() body: CreateLotBodyDto) {
    return this.lotsService.createLot({ body });
  }

  @Patch('/:id')
  async updateLot(@Param('id') id: string, @Body() body: UpdateLotBodyDto) {
    return this.lotsService.updateLot({ id, body });
  }

  @Delete('/:id')
  async deleteLot(@Param('id') id: string) {
    return this.lotsService.deleteLot({ id });
  }

  @Get('/')
  async findLots(@Query() query: FindLotsQueryDto) {
    return this.lotsService.findLots({ query });
  }

  @Get('/:id')
  async findLotById(@Param('id') id: string) {
    return this.lotsService.findOne({ filter: { _id: id } });
  }
}
