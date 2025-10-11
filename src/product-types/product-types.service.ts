import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { ProductType } from './schema/product-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductTypeBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypeBodyDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypesService extends BaseCrudService<ProductType> {
  constructor(
    @InjectModel(ProductType.name) private productTypeModel: Model<ProductType>,
  ) {
    super(productTypeModel);
  }

  // POST /product-types
  async createProductType({ body }: { body: CreateProductTypeBodyDto }) {
    const { name, description } = body;

    return await this.create({
      doc: { name, description },
    });
  }

  // PATCH /product-types/:id
  async updateProductType({
    id,
    body,
  }: {
    id: string;
    body: UpdateProductTypeBodyDto;
  }) {
    const { name, description } = body;

    const newProductType = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, description },
    });
    if (!newProductType) {
      throw new NotFoundException('Product type id not found');
    }

    return newProductType;
  }
}
