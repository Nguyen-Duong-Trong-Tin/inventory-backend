import { Model, RootFilterQuery } from 'mongoose';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Warehouse } from './schema/warehouse.schema';
import { CreateWarehouseBodyDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseBodyDto } from './dto/update-warehouse.dto';
import { FindWarehousesQueryDto } from './dto/find-warehouses.dto';

import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class WarehousesService extends BaseCrudService<Warehouse> {
  constructor(
    @InjectModel(Warehouse.name) private warehouseModel: Model<Warehouse>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(warehouseModel);
  }

  // POST /warehouses
  async createWarehouse({
    body,
    employee,
  }: {
    body: CreateWarehouseBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, address } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-warehouse')) {
      throw new UnauthorizedException('You don’t have permission to create warehouses');
    }

    return this.create({
      doc: { name, address },
    });
  }

  // PATCH /warehouses/:id
  async updateWarehouse({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateWarehouseBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, address } = body;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-warehouse')) {
      throw new UnauthorizedException('You don’t have permission to update warehouses');
    }

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
  async deletewarehouse({
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

    if (!role.permisstion?.includes('delete-warehouse')) {
      throw new UnauthorizedException('You don’t have permission to delete warehouses');
    }

    const deletedWarehouse = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Warehouse>,
    });

    if (!deletedWarehouse) {
      throw new NotFoundException('Warehouse id not found');
    }

    return deletedWarehouse;
  }

  // GET /warehouses
  async findWarehouses({
    query,
    employee,
  }: {
    query: FindWarehousesQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-warehouse')) {
      throw new UnauthorizedException('You don’t have permission to view warehouses');
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<Warehouse> = {};
    let sort = {};

    if (filter) {
      const { name, address, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name, $options: 'i' };
      }

      if (address) {
        filterOptions.address = { $regex: address, $options: 'i' };
      }

      sort = sortHelper(sortBy, sortOrder);
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
