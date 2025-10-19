import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post,
  Query
} from '@nestjs/common';

import { WarehouseReceiptsService } from './warehouse-receipts.service';
import { CreateWarehouseReceiptBodyDto } from './dto/create-warehousereceipts.dto';
import { UpdateWarehouseReceiptBodyDto } from './dto/update-warehousereceipts.dto';
import { FindWarehousesReceiptsQueryDto } from './dto/find-warehousereceipts.dto';

@Controller({
  path: 'warehouse-receipts',
  version: '1',
})
export class WarehouseReceiptsController {
  constructor(private readonly warehouseReceiptsService: WarehouseReceiptsService) {}

  @Post('/')
  async createWarehouseReceipt(@Body() body: CreateWarehouseReceiptBodyDto){
    return this.warehouseReceiptsService.createWarehouseReceipt({body});
  }

  @Patch('/:id')
  async updateWarehouseReceipt(
    @Param('id') id: string,
    @Body() body: UpdateWarehouseReceiptBodyDto,
  ) {
    return this.warehouseReceiptsService.updateWarehouseReceipt({ id, body });
  }

  @Delete('/:id')
  async deleteWarehouseReceipt(@Param('id') id: string) {
    return this.warehouseReceiptsService.deleteWarehouseReceipt({ id });
  }

  @Get('/')
  async findWarehouseReceipts(@Query() query: FindWarehousesReceiptsQueryDto) {
    return this.warehouseReceiptsService.findWarehouseReceipts({ query });
  }
  
  @Get('/:id')
  async findWarehouseReceiptById(@Param('id') id: string) {
    return this.warehouseReceiptsService.findOne({ filter: { _id: id } });
  }
}
