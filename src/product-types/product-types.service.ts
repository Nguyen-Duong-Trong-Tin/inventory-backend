import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { ProductTypes } from './schema/product-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateProductTypesBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypesBodyDto } from './dto/update-product-type.dto';
import { FindProDuctTypesQueryDto } from './dto/find-product-types.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class ProductTypesService extends 
BaseCrudService<ProductTypes> {
  constructor(
    @InjectModel(ProductTypes.name) 
    private ProductTypesModel: Model<ProductTypes>,
  ) {
    super(ProductTypesModel);
  }

  // POST /product-types
  async createProductTypes({ body }: { body: CreateProductTypesBodyDto }) {
    const { name, description } = body;

    return await this.create({
      doc: { name, description },
    });
  }

  // PATCH /product-types/:id
  async updateProductTypes({
    id,
    body,
  }: {
    id: string;
    body: UpdateProductTypesBodyDto;
  }) {
    const { name, description } = body;

    const newProductTypes = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name,description },
    });
    if (!newProductTypes) {
      throw new NotFoundException('Product Types id not found');
    }

    return newProductTypes;
  }

  // DELETE /product-types/:id
  async deleteProductTypes({ id }: { id: string }) {
    const deleteProductTypes = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<ProductTypes>,
    });

    if (!deleteProductTypes) {
      throw new NotFoundException('Supplier id not found');
    }

    return deleteProductTypes;
  }

// GET /product-types
  async findProductTypes({ query }: { query: FindProDuctTypesQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<ProductTypes> = {};
    let sort = {};

    if (filter) {
      const { name, description, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (description) {
        filterOptions.email = { $regex: description as string, $options: 'i' };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    const pagination = paginationHelper(page, limit);

    const [ProductTypes, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      ProductTypes: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        ProductTypes,
      },
    };
  }
  
  
    // GET /product-types/:id
    async findProductTypesById({ id }: { id: string }) {
      const ProductTypesExists = await this.findOne({
        filter: { _id: id } as RootFilterQuery<ProductTypes>,
      });
  
      if (!ProductTypesExists) {
        throw new NotFoundException('Product Types id not found');
      }
  
      return ProductTypesExists;
    }

}