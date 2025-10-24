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

import { ProductTypesService } from './product-types.service';
import { CreateProductTypeBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypesBodyDto } from './dto/update-product-type.dto';
import { FindProDuctTypeQueryDto } from './dto/find-product-type.dto';

@Controller({
  path: 'product-types',
  version: '1',
})
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post('/')
  async createProductType(@Body() body: CreateProductTypeBodyDto) {
    return await this.productTypesService.createProductType({ body });
  }

  @Patch('/:id')
  async updateProductTypes(
    @Param('id') id: string,
    @Body() body: UpdateProductTypesBodyDto,
  ) {
    return this.productTypesService.updateProductTypes({ id, body });
  }

  @Delete('/:id')
  async deleteProductTypes(@Param('id') id: string) {
    return this.productTypesService.deleteProductType({ id });
  }

  @Get('/')
  async findProductType(@Query() query: FindProDuctTypeQueryDto) {
    return this.productTypesService.findProductType({ query });
  }

  @Get('/:id')
  async findProductTypesById(@Param('id') id: string) {
    return this.productTypesService.findOne({ filter: { _id: id } });
  }
}
