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
import { CreateProductTypesBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypesBodyDto } from './dto/update-product-type.dto';
import { FindProDuctTypesQueryDto } from './dto/find-product-types.dto';

@Controller({
  path: 'product-types',
  version: '1',
})
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post('/')
  async createProductType(@Body() body: CreateProductTypesBodyDto) {
    return await this.productTypesService.createProductTypes({ body });
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
      return this.productTypesService.deleteProductTypes({ id });
    }

    @Get('/')
    async findProductTypes(@Query() query: FindProDuctTypesQueryDto) {
      return this.productTypesService.findProductTypes({ query });
    }

    @Get('/:id')
    async findProductTypesById(@Param('id') id: string) {
      return this.productTypesService.findOne({ filter: { _id: id } });
  }

}
