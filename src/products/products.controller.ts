import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductBodyDto } from './dto/create-product.dto';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  async createProduct(@Body() body: CreateProductBodyDto) {
    return this.productsService.createSupplier({ body });
  }
}
