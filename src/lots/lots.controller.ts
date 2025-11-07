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

import { LotsService } from './lots.service';
import { CreateLotBodyDto } from './dto/create-lot.dto';
import { UpdateLotBodyDto } from './dto/update-lot.dto';
import { FindLotsQueryDto } from './dto/find-lots.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'lots',
  version: '1',
})
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createLot(
    @Body() body: CreateLotBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.lotsService.createLot({ body, employee: user  });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateLot(
    @Param('id') id: string, 
    @Body() body: UpdateLotBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.lotsService.updateLot({ id, body, employee: user  });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteLot(
    @Param('id') id: string,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.lotsService.deleteLot({ id, employee: user  });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findLots(
    @Query() query: FindLotsQueryDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.lotsService.findLots({ query, employee: user  });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findLotById(@Param('id') id: string) {
    return this.lotsService.findOne({ filter: { _id: id } });
  }
}
