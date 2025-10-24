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

import { WarehousesService } from './warehouses.service';
import { CreateWarehouseBodyDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseBodyDto } from './dto/update-warehouse.dto';
import { FindWarehousesQueryDto } from './dto/find-warehouses.dto';

@Controller({
  path: 'warehouses',
  version: '1',
})
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post('/')
  async createWarehouse(@Body() body: CreateWarehouseBodyDto) {
    return this.warehousesService.createWarehouse({ body });
  }

  @Patch('/:id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() body: UpdateWarehouseBodyDto,
  ) {
    return this.warehousesService.updateWarehouse({ id, body });
  }

  @Delete('/:id')
  async deleteWarehouse(@Param('id') id: string) {
    return this.warehousesService.deletewarehouse({ id });
  }

  @Get('/')
  async findWarehouses(@Query() query: FindWarehousesQueryDto) {
    return this.warehousesService.findWarehouses({ query });
  }

  @Get('/:id')
  async findWarehouseById(@Param('id') id: string) {
    return this.warehousesService.findOne({ filter: { _id: id } });
  }
}
