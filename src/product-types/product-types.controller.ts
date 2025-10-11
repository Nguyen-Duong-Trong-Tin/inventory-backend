import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypeBodyDto } from './dto/update-product-type.dto';

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
  async updateProductType(
    @Param('id') id: string,
    @Body() body: UpdateProductTypeBodyDto,
  ) {
    return this.productTypesService.updateProductType({ id, body });
  }
}
