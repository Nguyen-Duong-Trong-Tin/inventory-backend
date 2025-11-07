import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { RolesService } from 'src/roles/roles.service';
import { CreateEmployeeBodyDto } from './dto/create-employee.dto';
import * as crypto from 'crypto';
import { Employee } from './schema/employee.schema';
import { UpdateEmployeeBodyDto } from './dto/update-employee.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { FindEmployeesQueryDto } from './dto/find-employees.dto';

@Injectable()
export class EmployeesService extends BaseCrudService<Employee> {
  constructor(
    @Inject(forwardRef(() => RolesService)) 
    private readonly rolesService: RolesService,

    @InjectModel(Employee.name)
    private employeeModel: Model<Employee>,
  ) {
    super(employeeModel);
  }

  async login({ email, password }: { email: string; password: string }) {
    // md5
    const hashedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    return await this.findOne({ filter: { email, password: hashedPassword } });
  }

  // POST /employees
  async createEmployee({
    body,
    employee,
  }: {
    body: CreateEmployeeBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, phone, email, address, password, roleId } = body;

    const creator = await this.findOne({ filter: { _id: userId } });
    if (!creator) {
      throw new UnauthorizedException('Employee id not found');
    }

    const creatorRole = await this.rolesService.findOne({
      filter: { _id: creator.roleId },
    });
    if (!creatorRole) {
      throw new UnauthorizedException('Role id not found');
    }

    if (!creatorRole.permisstion?.includes('create-employee')) {
      throw new UnauthorizedException('You don’t have permission to create employees');
    }

    const roleExists = await this.rolesService.findOne({
      filter: { _id: roleId },
    });
    if (!roleExists) {
      throw new NotFoundException('Role id not found');
    }

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    return await this.create({
      doc: { name, phone, email, address, password: hashedPassword, roleId },
    });
  }

  // PATCH /employees/:id
  async updateEmployee({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateEmployeeBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { name, phone, email, address, password, roleId } = body;

    const actor = await this.findOne({ filter: { _id: userId } });
    if (!actor) {
      throw new UnauthorizedException('Employee id not found');
    }

    const actorRole = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!actorRole || !actorRole.permisstion?.includes('update-employee')) {
      throw new UnauthorizedException('You don’t have permission to update employees');
    }

    const roleExists = await this.rolesService.findOne({
      filter: { _id: roleId },
    });
    if (!roleExists) {
      throw new NotFoundException('Role id not found');
    }

    let updateData: any = { name, phone, email, address, roleId };

    if (password) {
      updateData.password = crypto.createHash('md5').update(password).digest('hex');
    }

    const updatedEmployee = await this.findOneAndUpdate({
      filter: { _id: id },
      update: updateData,
    });

    if (!updatedEmployee) {
      throw new NotFoundException('Employee id not found');
    }

    return updatedEmployee;
  }

  // DELETE /employee/:id
  async deleteEmployee({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.findOne({ filter: { _id: userId } });
    if (!actor) {
      throw new UnauthorizedException('Employee id not found');
    }

    const actorRole = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!actorRole || !actorRole.permisstion?.includes('delete-employee')) {
      throw new UnauthorizedException('You don’t have permission to delete employees');
    }

    const deletedEmployee = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Employee>,
    });

    if (!deletedEmployee) {
      throw new NotFoundException('Employee id not found');
    }

    return deletedEmployee;
  }

  // GET /employees
  async findEmployees({
    query,
    employee,
  }: {
    query: FindEmployeesQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.findOne({ filter: { _id: userId } });
    if (!actor) {
      throw new UnauthorizedException('Employee id not found');
    }

    const actorRole = await this.rolesService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!actorRole || !actorRole.permisstion?.includes('read-employee')) {
      throw new UnauthorizedException('You don’t have permission to view employees');
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<Employee> = {};
    let sort = {};

    if (filter) {
      const { name, phone, email, address, roleId, sortBy, sortOrder } = filter;

      if (name) filterOptions.name = { $regex: name, $options: 'i' };
      if (phone) filterOptions.phone = { $regex: phone, $options: 'i' };
      if (email) filterOptions.email = { $regex: email, $options: 'i' };
      if (address) filterOptions.address = { $regex: address, $options: 'i' };
      if (roleId) filterOptions.roleId = { $regex: roleId, $options: 'i' };

      sort = sortHelper(sortBy, sortOrder);
    }

    const pagination = paginationHelper(page, limit);

    const [employees, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      employees: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        employees,
      },
    };
  }

  // GET /employees/:id
  async findEmployeeById({ id }: { id: string }) {
    const employeeExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Employee>,
    });

    if (!employeeExists) {
      throw new NotFoundException('Employee id not found');
    }

    return employeeExists;
  }
}
