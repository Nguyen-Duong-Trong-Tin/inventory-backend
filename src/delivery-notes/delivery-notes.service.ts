import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class DeliveryNotesService extends BaseCrudService<DeliveryNote> {
  constructor(
    private readonly warehouseService: WarehousesService,
    private readonly employeeService: EmployeesService,
    private readonly customerService: CustomersService,
    @InjectModel(DeliveryNote.name)
    private readonly deliveryNoteModel: Model<DeliveryNote>,
  ) {
    super(deliveryNoteModel);
  }

  // POST /deliverynotes
  async createDeliveryNote({ body }: { body: CreateDeliveryNoteBodyDto }) {
    const { deliveryNo, date, warehouseId, employeeId, customerId } = body;

    //Kiểm tra kho (warehouse)
    const warehouseExists = await this.warehouseService.findOne({
      filter: { _id: warehouseId },
    });
    if (!warehouseExists) {
      throw new NotFoundException('Warehouse id not found');
    }

    //Kiểm tra nhân viên (employee)
    const employeeExists = await this.employeeService.findOne({
      filter: { _id: employeeId },
    });
    if (!employeeExists) {
      throw new NotFoundException('Employee id not found');
    }

    //Kiểm tra khách hàng (customer)
    const customerExists = await this.customerService.findOne({
      filter: { _id: customerId },
    });
    if (!customerExists) {
      throw new NotFoundException('Customer id not found');
    }

    //Tạo mới DeliveryNote
    return this.create({
      doc: { deliveryNo, date, warehouseId, employeeId, customerId },
    });
  }

  // PATCH /deliverynotes/:id
  async updateDeliveryNote({
    id,
    body,
  }: {
    id: string;
    body: UpdateDeliveryNoteBodyDto;
  }) {
    const { deliveryNo, date, warehouseId, employeeId, customerId } = body;

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
  async deletedeliverynote({ id }: { id: string }) {
    const deleted_deliverynote = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<DeliveryNote>,
    });

    if (!deleted_deliverynote) {
      throw new NotFoundException('DeliveryNote id not found');
    }

    return deleted_deliverynote;
  }

  // GET /deliverynotes
  async findDeliveryNotes({ query }: { query: FindDeliveryNotesQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<DeliveryNote> = {};
    let sort = {};

    if (filter) {
      const { deliveryNo, date, warehouseId, employeeId, customerId, sortBy, sortOrder } = filter;

      if (deliveryNo) {
        filterOptions.name = { $regex: deliveryNo as string, $options: 'i' };
      }

      if (date) {
        filterOptions.status = { $regex: date as Date, $options: 'i' };
      }

      if (warehouseId) {
        filterOptions.warehouseId = { $regex: warehouseId as string, $options: 'i' };
      }


      if (employeeId) {
        filterOptions.employeeId = { $regex: employeeId as string, $options: 'i' };
      }


      if (customerId) {
        filterOptions.customerId = { $regex: customerId as string, $options: 'i' };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
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
