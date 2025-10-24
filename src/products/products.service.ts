import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Product } from './schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateProductBodyDto } from './dto/create-product.dto';
import { ProductTypesService } from 'src/product-types/product-types.service';
import { UpdateProductBodyDto } from './dto/update-product.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { FindProductsQueryDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService extends BaseCrudService<Product> {
  constructor(
    private readonly productTypesService: ProductTypesService,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {
    super(productModel);
  }

  // POST /products
  async createProduct({ body }: { body: CreateProductBodyDto }) {
    const { name, status, unit, productTypeId } = body;

    //Kiểm tra loại sản phẩm
    const productTypeExists = await this.productTypesService.findOne({
      filter: { _id: productTypeId },
    });
    if (!productTypeExists) {
      throw new NotFoundException('Product type id not found');
    }

    return await this.create({
      doc: { name, status, unit, productTypeId },
    });
  }

  // PATCH /products/:id
  async updateProduct({
    id,
    body,
  }: {
    id: string;
    body: UpdateProductBodyDto;
  }) {
    const { name, status, unit, productTypeId } = body;

    const newProduct = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, status, unit, productTypeId },
    });
    if (!newProduct) {
      throw new NotFoundException('Product id not found');
    }

    return newProduct;
  }

  // DELETE /product/:id
  async deleteproduct({ id }: { id: string }) {
    const deletedproduct = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Product>,
    });

    if (!deletedproduct) {
      throw new NotFoundException('Product id not found');
    }

    return deletedproduct;
  }

  // GET /products
  async findProducts({ query }: { query: FindProductsQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<Product> = {};
    let sort = {};

    if (filter) {
      const { name, status, unit, productTypeId, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (status) {
        filterOptions.status = { $regex: status as string, $options: 'i' };
      }

      if (unit) {
        filterOptions.unit = { $regex: unit as number, $options: 'i' };
      }

      if (productTypeId) {
        filterOptions.productTypeId = {
          $regex: productTypeId as string,
          $options: 'i',
        };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    const pagination = paginationHelper(page, limit);

    const [products, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      products: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        products,
      },
    };
  }

  // GET /products/:id
  async findProductById({ id }: { id: string }) {
    const productExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Product>,
    });

    if (!productExists) {
      throw new NotFoundException('Product id not found');
    }

    return productExists;
  }
}
