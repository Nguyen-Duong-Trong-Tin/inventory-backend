import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Role } from './schema/role.schema';
import { CreateRoleBodyDto } from './dto/create-role.dto';
import { UpdateRoleBodyDto } from './dto/update-role.dto';
import { FindRolesQueryDto } from './dto/find-roles.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class RolesService extends BaseCrudService<Role> {
    constructor(
        @InjectModel(Role.name) 
        private roleModel: Model<Role>,
    ) {
        super(roleModel);
    }

    // POST /roles
    async createRole({ body }: { body: CreateRoleBodyDto }) {
        const { name, description, permisstion } = body;

        return await this.create({
        doc: { name, description, permisstion },
        });
    }

    // PATCH /roles/:id
    async updateRole({
        id,
        body,
    }: {
        id: string;
        body: UpdateRoleBodyDto;
    }) {
        const { name, description, permisstion } = body;
    
        const newRole = await this.findOneAndUpdate({
          filter: { _id: id },
          update: { name, description, permisstion },
    });
        if (!newRole) {
          throw new NotFoundException('Role id not found');
        }
    
        return newRole;
    }

    // DELETE /roles/:id
    async deleteRole({ id }: { id: string }) {
        const deletedRole = await this.findOneAndDelete({
          filter: { _id: id } as RootFilterQuery<Role>,
        });
    
        if (!deletedRole) {
          throw new NotFoundException('Role id not found');
        }
    
        return deletedRole;
    }

    // GET /roles
    async findRoles({ query }: { query: FindRolesQueryDto }) {
        const { filter, page, limit } = query;
    
        const filterOptions: RootFilterQuery<Role> = {};
        let sort = {};
    
        if (filter) {
          const { name, description, permisstion, sortBy, sortOrder } = filter;
    
          if (name) {
            filterOptions.name = { $regex: name as string, $options: 'i' };
          }
    
          if (description) {
            filterOptions.description = { $regex: description as string, $options: 'i' };
          }
    
          if (permisstion) {
            filterOptions.permisstion = { $regex: permisstion as string, $options: 'i' };
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
