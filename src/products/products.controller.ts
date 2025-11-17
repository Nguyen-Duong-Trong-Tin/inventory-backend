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
  async createProduct(
    @Body() body: CreateProductBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.productsService.createProduct({ body, employee: user });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductBodyDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.productsService.updateProduct({ id, body, employee: user });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Param('id') id: string,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.productsService.deleteproduct({ id, employee: user });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findProducts(
    @Query() query: FindProductsQueryDto,
    @Request() { user }: { user: { userId: string; email: string } },
  ) {
    return this.productsService.findProducts({ query, employee: user });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findProductById(@Param('id') id: string) {
    return this.productsService.findOne({ filter: { _id: id } });
  }
}
