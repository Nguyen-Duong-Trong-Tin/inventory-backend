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

import { ProductsService } from './products.service';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { UpdateProductBodyDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products.dto';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  async createProduct(@Body() body: CreateProductBodyDto) {
    return this.productsService.createProduct({ body });
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductBodyDto,
  ){
    return this.productsService.updateProduct({id, body});
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteproduct({ id });
  }

  @Get('/')
  async findProducts(@Query() query: FindProductsQueryDto) {
    return this.productsService.findProducts({ query });
  }

  @Get('/:id')
  async findProductById(@Param('id') id: string) {
    return this.productsService.findOne({ filter: { _id: id } });
  }
}