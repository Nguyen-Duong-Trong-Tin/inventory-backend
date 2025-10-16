import { Injectable, NotFoundException } from '@nestjs/common';
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
        private readonly rolesService: RolesService,
        @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    ) {
        super(employeeModel);
    }

    // POST /employees
    async createEmployee({ body }: { body: CreateEmployeeBodyDto }) {
        const { name, phone, email, address, password, roleId } = body;

        const roleExists = await this.rolesService.findOne({
            filter: { _id: roleId },
        });
        if (!roleExists) {
            throw new NotFoundException('Role id not found');
        }

        // md5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        return await this.create({
            doc: { name, phone, email, address, password: hashedPassword, roleId },
        });
    }

    // PATCH /employees/:id
    async updateEmployee({
        id,
        body,
      }: {
        id: string;
        body: UpdateEmployeeBodyDto;
      }) {
        const { name, phone, email, address, password, roleId  } = body;
    
        const newEmployee = await this.findOneAndUpdate({
          filter: { _id: id },
          update: { name, phone, email, address, password, roleId  },
        });
        if (!newEmployee) {
          throw new NotFoundException('Employee id not found');
        }
    
        return newEmployee;
    }

    // DELETE /employee/:id
    async deleteEmployee({ id }: { id: string }) {
        const deletedEmployee = await this.findOneAndDelete({
          filter: { _id: id } as RootFilterQuery<Employee>,
        });
    
        if (!deletedEmployee) {
          throw new NotFoundException('Employee id not found');
        }
    
        return deletedEmployee;
    }

    // GET /employees
    async findEmployees({ query }: { query: FindEmployeesQueryDto }) {
        const { filter, page, limit } = query;
    
        const filterOptions: RootFilterQuery<Employee> = {};
        let sort = {};
    
        if (filter) {
          const { name, phone, email, address, roleId, sortBy, sortOrder } = filter;
    
          if (name) {
            filterOptions.name = { $regex: name as string, $options: 'i' };
          }
    
          if (phone) {
            filterOptions.phone = { $regex: phone as string, $options: 'i' };
          }
    
          if (email) {
            filterOptions.email = { $regex: email as string, $options: 'i' };
          }

          if (address) {
            filterOptions.address = { $regex: address as string, $options: 'i' };
          }

          if (roleId) {
            filterOptions.roleId = { $regex: roleId as string, $options: 'i' };
          }
    
          sort = sortHelper(sortBy as string, sortOrder as string);
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
