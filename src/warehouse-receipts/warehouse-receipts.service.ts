import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { WarehouseReceipt } from './schema/warehousereceipts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateWarehouseReceiptBodyDto } from './dto/create-warehousereceipts.dto';
import { UpdateWarehouseReceiptBodyDto } from './dto/update-warehousereceipts.dto';
import { FindWarehousesReceiptsQueryDto } from './dto/find-warehousereceipts.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { EmployeesService } from 'src/employees/employees.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Injectable()
export class WarehouseReceiptsService extends BaseCrudService<WarehouseReceipt> {
  constructor(
    private readonly warehouseService: WarehousesService,
    private readonly employeeService: EmployeesService,
    private readonly suppliersService: SuppliersService,
    @InjectModel(WarehouseReceipt.name)
    private readonly warehouseReceiptModel: Model<WarehouseReceipt>,
  ) {
    super(warehouseReceiptModel);
  }

  // POST /warehouse-receipts
  async createWarehouseReceipt({
    body,
  }: {
    body: CreateWarehouseReceiptBodyDto;
  }) {
    const { date, receiptNo, supplierId, warehouseId, employeeId } = body;

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

    //Kiểm tra nhà cung cấp (supplier)
    const supplierExists = await this.suppliersService.findOne({
      filter: { _id: supplierId },
    });
    if (!supplierExists) {
      throw new NotFoundException('Supplier id not found');
    }

    //Tạo mới WarehouseReceipt
    return await this.create({
      doc: { date, receiptNo, supplierId, warehouseId, employeeId },
    });
  }

  // PATCH /warehouse-receipts/:id
  async updateWarehouseReceipt({
    id,
    body,
  }: {
    id: string;
    body: UpdateWarehouseReceiptBodyDto;
  }) {
    const { date, receiptNo, supplierId, warehouseId, employeeId } = body;

    const newWarehouseReceipt = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { date, receiptNo, supplierId, warehouseId, employeeId },
    });
    if (!newWarehouseReceipt) {
      throw new NotFoundException('Warehouse Receipt id not found');
    }

    return newWarehouseReceipt;
  }

  //DELETE /warehouse-receipts/:id
  async deleteWarehouseReceipt({ id }: { id: string }) {
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
  }: {
    query: FindWarehousesReceiptsQueryDto;
  }) {
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
        filterOptions.date = { $regex: date, $options: 'i' };
      }

      if (receiptNo) {
        filterOptions.receiptNo = {
          $regex: receiptNo as string,
          $options: 'i',
        };
      }

      if (supplierId) {
        filterOptions.supplierId = {
          $regex: supplierId as string,
          $options: 'i',
        };
      }

      if (warehouseId) {
        filterOptions.warehouseId = {
          $regex: warehouseId as string,
          $options: 'i',
        };
      }

      if (employeeId) {
        filterOptions.employeeId = {
          $regex: employeeId as string,
          $options: 'i',
        };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
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
      wareshouseReceipts: {
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
}
