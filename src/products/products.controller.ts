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

import { ProductsService } from './products.service';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { UpdateProductBodyDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: CreateProductBodyDto) {
    return this.productsService.createProduct({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductBodyDto,
  ) {
    return this.productsService.updateProduct({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteproduct({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findProducts(@Query() query: FindProductsQueryDto) {
    return this.productsService.findProducts({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findProductById(@Param('id') id: string) {
    return this.productsService.findOne({ filter: { _id: id } });
  }
}
