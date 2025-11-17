import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Customer } from './schema/customer.schema';
import { CreateCustomerBodyDto } from './dto/create-customer.dto';
import { UpdateCustomerBodyDto } from './dto/update-customer.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { FindCustomersQueryDto } from './dto/find-customers.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class CustomersService extends BaseCrudService<Customer> {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly employeesService: EmployeesService,
    private readonly rolesService: RolesService,
  ) {
    super(customerModel);
  }

  // POST /customers
  async createCustomer({
    body,
    employee,
  }: {
    body: CreateCustomerBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-customer')) {
      throw new UnauthorizedException(
        'You don’t have permission to create customers',
      );
    }

    const { name, phone } = body;
    return this.create({ doc: { name, phone } });
  }

  // PATCH /customers/:id
  async updateCustomer({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateCustomerBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-customer')) {
      throw new UnauthorizedException(
        'You don’t have permission to update customers',
      );
    }

    const { name, phone } = body;

    const newCustomer = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, phone },
    });

    if (!newCustomer) {
      throw new NotFoundException('Customer id not found');
    }

    return newCustomer;
  }

  // DELETE /customers/:id
  async deleteCustomer({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('delete-customer')) {
      throw new UnauthorizedException(
        'You don’t have permission to delete customers',
      );
    }

    const deletedCustomer = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Customer>,
    });

    if (!deletedCustomer) {
      throw new NotFoundException('Customer id not found');
    }

    return deletedCustomer;
  }

  //GET /customers
  async findCustomers({
    query,
    employee,
  }: {
    query: FindCustomersQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-customer')) {
      throw new UnauthorizedException(
        'You don’t have permission to view customers',
      );
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<Customer> = {};
    let sort = {};

    if (filter) {
      const { name, phone, sortBy, sortOrder } = filter;

      if (name) filterOptions.name = { $regex: name, $options: 'i' };
      if (phone) filterOptions.phone = { $regex: phone, $options: 'i' };

      sort = sortHelper(sortBy, sortOrder);
    }

    const pagination = paginationHelper(page, limit);

    const [customers, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      customers: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        customers,
      },
    };
  }

  // GET /customers/:id
  async findCustomerById({ id }: { id: string }) {
    const customerExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Customer>,
    });

    if (!customerExists) {
      throw new NotFoundException('Customer id not found');
    }

    return customerExists;
  }
}
