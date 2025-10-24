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

import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { CreateWarehouseReceiptBodyDto } from './dto/create-warehousereceipts.dto';
import { UpdateWarehouseReceiptBodyDto } from './dto/update-warehousereceipts.dto';
import { FindWarehousesReceiptsQueryDto } from './dto/find-warehousereceipts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'warehouse-receipts',
  version: '1',
})
export class WarehouseReceiptsController {
  constructor(
    private readonly warehouseReceiptsService: WarehouseReceiptsService,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createWarehouseReceipt(@Body() body: CreateWarehouseReceiptBodyDto) {
    return this.warehouseReceiptsService.createWarehouseReceipt({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWarehouseReceipt(
    @Param('id') id: string,
    @Body() body: UpdateWarehouseReceiptBodyDto,
  ) {
    return this.warehouseReceiptsService.updateWarehouseReceipt({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteWarehouseReceipt(@Param('id') id: string) {
    return this.warehouseReceiptsService.deleteWarehouseReceipt({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findWarehouseReceipts(@Query() query: FindWarehousesReceiptsQueryDto) {
    return this.warehouseReceiptsService.findWarehouseReceipts({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findWarehouseReceiptById(@Param('id') id: string) {
    return this.warehouseReceiptsService.findOne({ filter: { _id: id } });
  }
}
