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

import { SuppliersService } from './suppliers.service';
import { FindSuppliersQueryDto } from './dto/find-suppliers.dto';
import { CreateSupplierBodyDto } from './dto/create-supplier.dto';
import { UpdateSupplierBodyDto } from './dto/update-supplier.dto';

@Controller({
  path: 'suppliers',
  version: '1',
})
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('/')
  async createSupplier(@Body() body: CreateSupplierBodyDto) {
    return this.suppliersService.createSupplier({ body });
  }

  @Patch('/:id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() body: UpdateSupplierBodyDto,
  ) {
    return this.suppliersService.updateSupplier({ id, body });
  }

  @Delete('/:id')
  async deleteSupplier(@Param('id') id: string) {
    return this.suppliersService.deleteSupplier({ id });
  }

  @Get('/')
  async findSuppliers(@Query() query: FindSuppliersQueryDto) {
    return this.suppliersService.findSuppliers({ query });
  }

  @Get('/:id')
  async findSupplierById(@Param('id') id: string) {
    return this.suppliersService.findOne({ filter: { _id: id } });
  }
}
