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

import { WarehousesService } from './warehouses.service';
import { CreateWarehouseBodyDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseBodyDto } from './dto/update-warehouse.dto';
import { FindWarehousesQueryDto } from './dto/find-warehouses.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'warehouses',
  version: '1',
})
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createWarehouse(@Body() body: CreateWarehouseBodyDto) {
    return this.warehousesService.createWarehouse({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWarehouse(
    @Param('id') id: string,
    @Body() body: UpdateWarehouseBodyDto,
  ) {
    return this.warehousesService.updateWarehouse({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteWarehouse(@Param('id') id: string) {
    return this.warehousesService.deletewarehouse({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findWarehouses(@Query() query: FindWarehousesQueryDto) {
    return this.warehousesService.findWarehouses({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findWarehouseById(@Param('id') id: string) {
    return this.warehousesService.findOne({ filter: { _id: id } });
  }
}
