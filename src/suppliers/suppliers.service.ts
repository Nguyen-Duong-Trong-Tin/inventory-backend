import { Model, RootFilterQuery } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Supplier } from './schema/supplier.schema';
import { CreateSupplierBodyDto } from './dto/create-supplier.dto';
import { UpdateSupplierBodyDto } from './dto/update-supplier.dto';
import { FindSuppliersQueryDto } from './dto/find-suppliers.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class SuppliersService extends BaseCrudService<Supplier> {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {
    super(supplierModel);
  }

  // POST /suppliers
  async createSupplier({ body }: { body: CreateSupplierBodyDto }) {
    const { name, email, phone, address } = body;

    return await this.create({
      doc: { name, email, phone, address },
    });
  }

  // PATCH /suppliers/:id
  async updateSupplier({
    id,
    body,
  }: {
    id: string;
    body: UpdateSupplierBodyDto;
  }) {
    const { name, email, phone, address } = body;

    const newSupplier = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, email, phone, address },
    });
    if (!newSupplier) {
      throw new Error('Supplier id not found');
    }

    return newSupplier;
  }

  // DELETE /suppliers/:id
  async deleteSupplier({ id }: { id: string }) {
    const deletedSupplier = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Supplier>,
    });
    if (!deletedSupplier) {
      throw new Error('Supplier id not found');
    }

    return deletedSupplier;
  }

  // GET /suppliers
  async findSuppliers({ query }: { query: FindSuppliersQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<Supplier> = {};
    let sort = {};

    if (filter) {
      const { name, email, phone, address, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (email) {
        filterOptions.email = { $regex: email as string, $options: 'i' };
      }

      if (phone) {
        filterOptions.phone = { $regex: phone as string, $options: 'i' };
      }

      if (address) {
        filterOptions.address = { $regex: address as string, $options: 'i' };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    console.log(sort);

    const pagination = paginationHelper(page, limit);

    const [suppliers, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      suppliers: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        suppliers,
      },
    };
  }

  // GET /suppliers/:id
  async findSupplierById({ id }: { id: string }) {
    const supplierExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Supplier>,
    });

    if (!supplierExists) {
      throw new Error('Supplier id not found');
    }

    return supplierExists;
  }
}
