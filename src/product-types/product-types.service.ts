import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { ProductTypes } from './schema/product-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateProductTypeBodyDto } from './dto/create-product-type.dto';
import { UpdateProductTypesBodyDto } from './dto/update-product-type.dto';
import { FindProDuctTypeQueryDto } from './dto/find-product-type.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class ProductTypesService extends BaseCrudService<ProductTypes> {
  constructor(
    @InjectModel(ProductTypes.name)
    private ProductTypesModel: Model<ProductTypes>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(ProductTypesModel);
  }

  // POST /product-types
  async createProductType({
    body,
    employee,
  }: {
    body: CreateProductTypeBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, description } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-product-type')) {
      throw new UnauthorizedException('You don’t have permission to create product types');
    }

    return this.create({
      doc: { name, description },
    });
  }

  // PATCH /product-types/:id
  async updateProductTypes({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateProductTypesBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, description } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-product-type')) {
      throw new UnauthorizedException('You don’t have permission to update product types');
    }

    const newProductTypes = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, description },
    });

    if (!newProductTypes) {
      throw new NotFoundException('Product Types id not found');
    }

    return newProductTypes;
  }

  // DELETE /product-types/:id
  async deleteProductType({
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

    if (!role.permisstion?.includes('delete-product-type')) {
      throw new UnauthorizedException('You don’t have permission to delete product types');
    }

    const deleteProductType = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<ProductTypes>,
    });

    if (!deleteProductType) {
      throw new NotFoundException('Product Type id not found');
    }

    return deleteProductType;
  }

  // GET /product-types
  async findProductType({
    query,
    employee,
  }: {
    query: FindProDuctTypeQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-product-type')) {
      throw new UnauthorizedException('You don’t have permission to view product types');
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<ProductTypes> = {};
    let sort = {};

    if (filter) {
      const { name, description, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name, $options: 'i' };
      }

      if (description) {
        filterOptions.description = { $regex: description, $options: 'i' };
      }

      sort = sortHelper(sortBy, sortOrder);
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
  async findProductTypeById({ id }: { id: string }) {
    const ProductTypesExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<ProductTypes>,
    });

    if (!ProductTypesExists) {
      throw new NotFoundException('Product Type id not found');
    }

    return ProductTypesExists;
  }
}
