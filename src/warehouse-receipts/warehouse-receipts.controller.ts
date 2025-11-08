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
  async createWarehouseReceipt(
    @Body() body: CreateWarehouseReceiptBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.warehouseReceiptsService.createWarehouseReceipt({ body, employee: user  });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateWarehouseReceipt(
    @Param('id') id: string,
    @Body() body: UpdateWarehouseReceiptBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.warehouseReceiptsService.updateWarehouseReceipt({ id, body, employee: user  });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteWarehouseReceipt(
    @Param('id') id: string,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.warehouseReceiptsService.deleteWarehouseReceipt({ id, employee: user  });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findWarehouseReceipts(
    @Query() query: FindWarehousesReceiptsQueryDto,
    @Request() { user }: { user: { userId: string; email: string } },) {
    return this.warehouseReceiptsService.findWarehouseReceipts({ query, employee: user  });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findWarehouseReceiptById(@Param('id') id: string) {
    return this.warehouseReceiptsService.findOne({ filter: { _id: id } });
  }
}
