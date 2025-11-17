import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Role } from './schema/role.schema';
import { CreateRoleBodyDto } from './dto/create-role.dto';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { FindRolesQueryDto } from './dto/find-roles.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class RolesService extends BaseCrudService<Role> {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @Inject(forwardRef(() => EmployeesService))
    private readonly employeesService: EmployeesService,
  ) {
    super(roleModel);
  }

  // POST /roles
  async createRole({
    body,
    employee,
  }: {
    body: CreateRoleBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    // Exist employee
    const employeeExists = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!employeeExists) {
      throw new UnauthorizedException('Employee id not found');
    }

    // Role employee
    const roleExists = await this.findOne({
      filter: { _id: employeeExists.roleId },
    });
    if (!roleExists) {
      throw new UnauthorizedException('Role id not found');
    }

    // "create-role"
    const { permisstion } = roleExists;
    if (!permisstion?.includes('create-role')) {
      throw new UnauthorizedException(
        'You don’t have permission to create roles',
      );
    }

    // New role
    const { name, description, permisstion: newPermissions } = body;
    return await this.create({
      doc: { name, description, permisstion: newPermissions },
    });
  }

  // PATCH /roles/:id
  async updateRole({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateRoleBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const employeeExists = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!employeeExists) {
      throw new UnauthorizedException('Employee id not found');
    }

    const roleExists = await this.findOne({
      filter: { _id: employeeExists.roleId },
    });
    if (!roleExists) {
      throw new UnauthorizedException('Role id not found');
    }

    const { permisstion } = roleExists;
    if (!permisstion?.includes('update-role')) {
      throw new UnauthorizedException(
        'You don’t have permission to update roles',
      );
    }

    const { name, description, permisstion: newPermissions } = body;

    const updatedRole = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { name, description, permisstion: newPermissions },
    });

    if (!updatedRole) {
      throw new NotFoundException('Role id not found');
    }

    return updatedRole;
  }

  // DELETE /roles/:id
  async deleteRole({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const employeeExists = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!employeeExists) {
      throw new UnauthorizedException('Employee id not found');
    }

    const roleExists = await this.findOne({
      filter: { _id: employeeExists.roleId },
    });
    if (!roleExists) {
      throw new UnauthorizedException('Role id not found');
    }

    const { permisstion } = roleExists;
    if (!permisstion?.includes('delete-role')) {
      throw new UnauthorizedException(
        'You don’t have permission to delete roles',
      );
    }

    const deletedRole = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Role>,
    });

    if (!deletedRole) {
      throw new NotFoundException('Role id not found');
    }

    return deletedRole;
  }

  // GET /roles
  async findRoles({
    query,
    employee,
  }: {
    query: FindRolesQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const employeeExists = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!employeeExists) {
      throw new UnauthorizedException('Employee id not found');
    }

    const roleExists = await this.findOne({
      filter: { _id: employeeExists.roleId },
    });
    if (!roleExists) {
      throw new UnauthorizedException('Role id not found');
    }

    const { permisstion } = roleExists;
    if (!permisstion?.includes('read-role')) {
      throw new UnauthorizedException(
        'You don’t have permission to view roles',
      );
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<Role> = {};
    let sort = {};

    if (filter) {
      const { name, description, permisstion, sortBy, sortOrder } = filter;

      if (name) {
        filterOptions.name = { $regex: name as string, $options: 'i' };
      }

      if (description) {
        filterOptions.description = {
          $regex: description as string,
          $options: 'i',
        };
      }

      if (permisstion) {
        filterOptions.permisstion = {
          $regex: permisstion as string,
          $options: 'i',
        };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    const pagination = paginationHelper(page, limit);

    const [roles, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      roles: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        roles,
      },
    };
  }

  // GET /roles/:id
  async findRoleById({ id }: { id: string }) {
    const roleExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Role>,
    });

    if (!roleExists) {
      throw new NotFoundException('Role id not found');
    }

    return roleExists;
  }
}
