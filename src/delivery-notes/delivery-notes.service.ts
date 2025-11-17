import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { DeliveryNote } from './schema/deliverynote.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateDeliveryNoteBodyDto } from './dto/create-deliverynote.dto';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { EmployeesService } from 'src/employees/employees.service';
import { CustomersService } from 'src/customers/customers.service';
import { UpdateDeliveryNoteBodyDto } from './dto/update-deliverynote.dto';
import { FindDeliveryNotesQueryDto } from './dto/find-deliverynotes.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class DeliveryNotesService extends BaseCrudService<DeliveryNote> {
  constructor(
    private readonly warehouseService: WarehousesService,
    private readonly employeeService: EmployeesService,
    private readonly customerService: CustomersService,
    private readonly roleService: RolesService,
    @InjectModel(DeliveryNote.name)
    private readonly deliveryNoteModel: Model<DeliveryNote>,
  ) {
    super(deliveryNoteModel);
  }

  // POST /deliverynotes
  async createDeliveryNote({
    body,
    employee,
  }: {
    body: CreateDeliveryNoteBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { deliveryNo, date, warehouseId, employeeId, customerId } = body;

    const actor = await this.employeeService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-delivery-note')) {
      throw new UnauthorizedException(
        'You don’t have permission to create delivery notes',
      );
    }

    const warehouseExists = await this.warehouseService.findOne({
      filter: { _id: warehouseId },
    });
    if (!warehouseExists) throw new NotFoundException('Warehouse id not found');

    const employeeExists = await this.employeeService.findOne({
      filter: { _id: employeeId },
    });
    if (!employeeExists) throw new NotFoundException('Employee id not found');

    const customerExists = await this.customerService.findOne({
      filter: { _id: customerId },
    });
    if (!customerExists) throw new NotFoundException('Customer id not found');

    return this.create({
      doc: { deliveryNo, date, warehouseId, employeeId, customerId },
    });
  }

  // PATCH /deliverynotes/:id
  async updateDeliveryNote({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateDeliveryNoteBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { deliveryNo, date, warehouseId, employeeId, customerId } = body;

    const actor = await this.employeeService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-delivery-note')) {
      throw new UnauthorizedException(
        'You don’t have permission to update delivery notes',
      );
    }

    const newDeliveryNote = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { deliveryNo, date, warehouseId, employeeId, customerId },
    });

    if (!newDeliveryNote) {
      throw new NotFoundException('DeliveryNote id not found');
    }

    return newDeliveryNote;
  }

  // DELETE /deliverynote/:id
  async deletedeliverynote({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeeService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('delete-delivery-note')) {
      throw new UnauthorizedException(
        'You don’t have permission to delete delivery notes',
      );
    }

    const deleted_deliverynote = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<DeliveryNote>,
    });

    if (!deleted_deliverynote) {
      throw new NotFoundException('DeliveryNote id not found');
    }

    return deleted_deliverynote;
  }

  // GET /deliverynotes
  async findDeliveryNotes({
    query,
    employee,
  }: {
    query: FindDeliveryNotesQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeeService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-delivery-note')) {
      throw new UnauthorizedException(
        'You don’t have permission to view delivery notes',
      );
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<DeliveryNote> = {};
    let sort = {};

    if (filter) {
      const {
        deliveryNo,
        date,
        warehouseId,
        employeeId,
        customerId,
        sortBy,
        sortOrder,
      } = filter;

      if (deliveryNo) {
        filterOptions.deliveryNo = { $regex: deliveryNo, $options: 'i' };
      }

      if (date) {
        filterOptions.date = { $regex: date, $options: 'i' };
      }

      if (warehouseId) {
        filterOptions.warehouseId = { $regex: warehouseId, $options: 'i' };
      }

      if (employeeId) {
        filterOptions.employeeId = { $regex: employeeId, $options: 'i' };
      }

      if (customerId) {
        filterOptions.customerId = { $regex: customerId, $options: 'i' };
      }

      sort = sortHelper(sortBy, sortOrder);
    }

    const pagination = paginationHelper(page, limit);

    const [deliverynotes, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      deliverynotes: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        deliverynotes,
      },
    };
  }

  // GET /deliverynotes/:id
  async findDeliveryNoteById({ id }: { id: string }) {
    const deliverynoteExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<DeliveryNote>,
    });

    if (!deliverynoteExists) {
      throw new NotFoundException('DeliveyNote id not found');
    }

    return deliverynoteExists;
  }
}
