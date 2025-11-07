import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class ProductsService extends BaseCrudService<Product> {
  constructor(
    private readonly productTypesService: ProductTypesService,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(productModel);
  }

  // POST /products
  async createProduct({
    body,
    employee,
  }: {
    body: CreateProductBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, status, unit, productTypeId } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-product')) {
      throw new UnauthorizedException('You don’t have permission to create products');
    }

    const productTypeExists = await this.productTypesService.findOne({
      filter: { _id: productTypeId },
    });
    if (!productTypeExists) throw new NotFoundException('Product type id not found');

    return this.create({
      doc: { name, status, unit, productTypeId },
    });
  }

  // PATCH /products/:id
  async updateProduct({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateProductBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, status, unit, productTypeId } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-product')) {
      throw new UnauthorizedException('You don’t have permission to update products');
    }

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
  async deleteproduct({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('delete-product')) {
      throw new UnauthorizedException('You don’t have permission to delete products');
    }

    const deletedproduct = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Product>,
    });

    if (!deletedproduct) {
      throw new NotFoundException('Product id not found');
    }

    return deletedproduct;
  }

  // GET /products
  async findProducts({
    query,
    employee,
  }: {
    query: FindProductsQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-product')) {
      throw new UnauthorizedException('You don’t have permission to view products');
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<Product> = {};
    let sort = {};

    if (filter) {
      const { name, status, unit, productTypeId, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name, $options: 'i' };
      }

      if (status) {
        filterOptions.status = { $regex: status, $options: 'i' };
      }

      if (unit) {
        filterOptions.unit = { $regex: unit, $options: 'i' };
      }

      if (productTypeId) {
        filterOptions.productTypeId = { $regex: productTypeId, $options: 'i' };
      }

      sort = sortHelper(sortBy, sortOrder);
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
