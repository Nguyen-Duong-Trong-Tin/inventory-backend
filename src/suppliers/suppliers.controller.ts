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

import { SuppliersService } from './suppliers.service';
import { FindSuppliersQueryDto } from './dto/find-suppliers.dto';
import { CreateSupplierBodyDto } from './dto/create-supplier.dto';
import { UpdateSupplierBodyDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'suppliers',
  version: '1',
})
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createSupplier(@Body() body: CreateSupplierBodyDto) {
    return this.suppliersService.createSupplier({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateSupplier(
    @Param('id') id: string,
    @Body() body: UpdateSupplierBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.suppliersService.updateSupplier({ id, body, employee: user });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSupplier(@Param('id') id: string) {
    return this.suppliersService.deleteSupplier({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findSuppliers(@Query() query: FindSuppliersQueryDto) {
    return this.suppliersService.findSuppliers({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findSupplierById(@Param('id') id: string) {
    return this.suppliersService.findOne({ filter: { _id: id } });
  }
}
