import * as PDFDocument from 'pdfkit';
import { Model, RootFilterQuery } from 'mongoose';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import sortHelper from 'src/helpers/sort.helper';
import { RolesService } from 'src/roles/roles.service';
import { BaseCrudService } from 'src/cores/base-crud.core';
import paginationHelper from 'src/helpers/pagination.helper';
import { EmployeesService } from 'src/employees/employees.service';

import { WarehouseReceipt } from './schema/warehousereceipts.schema';
import { FindWarehousesReceiptsQueryDto } from './dto/find-warehousereceipts.dto';
import { CreateWarehouseReceiptBodyDto } from './dto/create-warehousereceipts.dto';
import { UpdateWarehouseReceiptBodyDto } from './dto/update-warehousereceipts.dto';

@Injectable()
export class WarehouseReceiptsService extends BaseCrudService<WarehouseReceipt> {
  constructor(
    @InjectModel(WarehouseReceipt.name)
    private warehouseReceiptModel: Model<WarehouseReceipt>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(warehouseReceiptModel);
  }

  // POST /warehouse-receipts
  async createWarehouseReceipt({
    body,
    employee,
  }: {
    body: CreateWarehouseReceiptBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { date, receiptNo, supplierId, warehouseId, employeeId } = body;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('create-warehouse-receipt')) {
      throw new UnauthorizedException(
        'You don’t have permission to create warehouse receipts',
      );
    }

    return this.create({
      doc: { date, receiptNo, supplierId, warehouseId, employeeId },
    });
  }

  // PATCH /warehouse-receipts/:id
  async updateWarehouseReceipt({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateWarehouseReceiptBodyDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { date, receiptNo, supplierId, warehouseId, employeeId } = body;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('update-warehouse-receipt')) {
      throw new UnauthorizedException(
        'You don’t have permission to update warehouse receipts',
      );
    }

    const newWarehouseReceipt = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { date, receiptNo, supplierId, warehouseId, employeeId },
    });

    if (!newWarehouseReceipt) {
      throw new NotFoundException('Warehouse Receipt id not found');
    }

    return newWarehouseReceipt;
  }

  // DELETE /warehouse-receipts/:id
  async deleteWarehouseReceipt({
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

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('delete-warehouse-receipt')) {
      throw new UnauthorizedException(
        'You don’t have permission to delete warehouse receipts',
      );
    }

    const deletedWarehouseReceipt = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<WarehouseReceipt>,
    });

    if (!deletedWarehouseReceipt) {
      throw new NotFoundException('Warehouse Receipt id not found');
    }

    return deletedWarehouseReceipt;
  }

  // GET /warehouse-receipts
  async findWarehouseReceipts({
    query,
    employee,
  }: {
    query: FindWarehousesReceiptsQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    if (!role.permisstion?.includes('read-warehouse-receipt')) {
      throw new UnauthorizedException(
        'You don’t have permission to view warehouse receipts',
      );
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<WarehouseReceipt> = {};
    let sort = {};

    if (filter) {
      const {
        date,
        receiptNo,
        supplierId,
        warehouseId,
        employeeId,
        sortBy,
        sortOrder,
      } = filter;

      if (date) {
        filterOptions.date = new Date(date); // ✅ dùng đúng kiểu Date
      }

      if (receiptNo) {
        filterOptions.receiptNo = { $regex: receiptNo, $options: 'i' };
      }

      if (supplierId) {
        filterOptions.supplierId = { $regex: supplierId, $options: 'i' };
      }

      if (warehouseId) {
        filterOptions.warehouseId = { $regex: warehouseId, $options: 'i' };
      }

      if (employeeId) {
        filterOptions.employeeId = { $regex: employeeId, $options: 'i' };
      }

      sort = sortHelper(sortBy, sortOrder);
    }

    const pagination = paginationHelper(page, limit);

    const [warehouseReceipts, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      warehouseReceipts: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        warehouseReceipts,
      },
    };
  }

  // GET /warehouse-receipts/:id
  async findWarehouseById({ id }: { id: string }) {
    const warehouseReceiptExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<WarehouseReceipt>,
    });

    if (!warehouseReceiptExists) {
      throw new NotFoundException('Warehouse Receipt id not found');
    }

    return warehouseReceiptExists;
  }

  async generatePDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      });

      // customize your PDF document
      doc.text('hello world', 100, 50);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}
