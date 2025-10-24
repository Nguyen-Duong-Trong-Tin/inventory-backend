import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Customer } from './schema/customer.schema';
import { CreateCustomerBodyDto } from './dto/create-customer.dto';
import { UpdateCustomerBodyDto } from './dto/update-customer.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { FindCustomersQueryDto } from './dto/find-customers.dto';

@Injectable()
export class CustomersService extends BaseCrudService<Customer> {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {
    super(customerModel);
  }

  // POST /customers
  async createCustomer({ body }: { body: CreateCustomerBodyDto }) {
    const { name, phone } = body;

    return await this.create({
      doc: { name, phone },
    });
  }

  // PATCH /customers/:id
  async updateCustomer({
    id,
    body,
  }: {
    id: string;
    body: UpdateCustomerBodyDto;
  }) {
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
  async deleteCustomer({ id }: { id: string }) {
    const deletedCustomer = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Customer>,
    });

    if (!deletedCustomer) {
      throw new NotFoundException('Customer id not found');
    }

    return deletedCustomer;
  }

  //GET /customers
  async findCustomers({ query }: { query: FindCustomersQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<Customer> = {};
    let sort = {};

    if (filter) {
      const { name, phone, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (phone) {
        filterOptions.phone = { $regex: phone as string, $options: 'i' };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
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
