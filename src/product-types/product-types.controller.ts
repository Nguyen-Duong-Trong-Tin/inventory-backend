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

import { ProductTypesService } from './product-types.service';
import { CreateProductTypeBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypesBodyDto } from './dto/update-product-type.dto';
import { FindProDuctTypeQueryDto } from './dto/find-product-type.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'product-types',
  version: '1',
})
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createProductType(@Body() body: CreateProductTypeBodyDto) {
    return await this.productTypesService.createProductType({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateProductTypes(
    @Param('id') id: string,
    @Body() body: UpdateProductTypesBodyDto,
  ) {
    return this.productTypesService.updateProductTypes({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProductTypes(@Param('id') id: string) {
    return this.productTypesService.deleteProductType({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findProductType(@Query() query: FindProDuctTypeQueryDto) {
    return this.productTypesService.findProductType({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findProductTypesById(@Param('id') id: string) {
    return this.productTypesService.findOne({ filter: { _id: id } });
  }
}
