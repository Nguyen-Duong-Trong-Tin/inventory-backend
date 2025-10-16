import { Model, RootFilterQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Warehouse } from './schema/warehouse.schema';
import { CreateWarehouseBodyDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseBodyDto } from './dto/update-warehouse.dto';
import { FindWarehousesQueryDto } from './dto/find-warehouses.dto';

import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class WarehousesService extends BaseCrudService<Warehouse> {
  constructor(
    @InjectModel(Warehouse.name) private warehouseModel: Model<Warehouse>,
  ) {
    super(warehouseModel);
  }

  // POST /warehouses
  async createWarehouse({ body }: { body: CreateWarehouseBodyDto }) {
    const { name, address } = body;

    return await this.create({
      doc: { name, address },
    });
  }

  // PATCH /warehouses/:id
  async updateWarehouse({
    id,
    body,
  }: {
    id: string;
    body: UpdateWarehouseBodyDto;
  }) {
    const { name, address } = body;

    const newWarehouse = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, address },
    });
    if (!newWarehouse) {
      throw new NotFoundException('Warehouse id not found');
    }

    return newWarehouse;
  }

  // DELETE /warehouses/:id
  async deletewarehouse({ id }: { id: string }) {
    const deletedWarehouse = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Warehouse>,
    });

    if (!deletedWarehouse) {
      throw new NotFoundException('Warehouse id not found');
    }

    return deletedWarehouse;
  }

  // GET /warehouses
  async findWarehouses({ query }: { query: FindWarehousesQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<Warehouse> = {};
    let sort = {};

    if (filter) {
      const { name, address, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (address) {
        filterOptions.address = { $regex: address as string, $options: 'i' };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    const pagination = paginationHelper(page, limit);

    const [warehouses, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      warehouses: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        warehouses,
      },
    };
  }

  // GET /warehouses/:id
  async findWarehouseById({ id }: { id: string }) {
    const warehouseExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Warehouse>,
    });

    if (!warehouseExists) {
      throw new NotFoundException('Warehouse id not found');
    }

    return warehouseExists;
  }
}
