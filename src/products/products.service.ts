import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { ProductTypesService } from 'src/product-types/product-types.service';

@Injectable()
export class ProductsService extends BaseCrudService<Product> {
  constructor(
    private readonly productTypesService: ProductTypesService,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {
    super(productModel);
  }

  // POST /products
  async createProduct({ body }: { body: CreateProductBodyDto }) {
    const { name, status, unit, productTypeId } = body;

    const productTypeExists = await this.productTypesService.findOne({
      filter: { _id: productTypeId },
    });
    if (!productTypeExists) {
      throw new NotFoundException('Product type id not found');
    }

    return await this.create({
      doc: { name, status, unit },
    });
  }
}
