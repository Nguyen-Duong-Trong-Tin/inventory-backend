import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { WarehouseReceipt } from './schema/warehousereceipts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateWarehouseReceiptBodyDto } from './dto/create-warehousereceipts.dto';
import { RolesService } from 'src/roles/roles.service';
import { UpdateWarehouseReceiptBodyDto } from './dto/update-warehousereceipts.dto';
import { FindWarehousesReceiptsQueryDto } from './dto/find-warehousereceipts.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class WarehouseReceiptsService extends BaseCrudService<WarehouseReceipt> {
    constructor(
        private readonly roleService: RolesService,
        private readonly employeesService: EmployeesService,
        private readonly warehousesService: WarehouseReceiptsService,
        private readonly suppliersService: WarehouseReceiptsService,
        @InjectModel(WarehouseReceipt.name) private warehouseReceiptModel: Model<WarehouseReceipt>,
    ) {
        super(warehouseReceiptModel);
    }

    // POST /warehouse-receipts
    async createWarehouseReceipt({ body }: { body: CreateWarehouseReceiptBodyDto }) {
        const{ date, receiptNo, supplierTypeId, warehouseId, employeeId } = body;

        return await this.create({
            doc: { date, receiptNo },
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
        const { date, receiptNo, supplierTypeId, warehouseId, employeeId } = body;

        const newWarehouseReceipt = await this.findOneAndUpdate({
            filter: { _id: id },
            update: { date, receiptNo, supplierTypeId, warehouseId, employeeId },
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
    async findWarehouseReceipts({ query }: { query: FindWarehousesReceiptsQueryDto }) {
        const { filter, page, limit } = query;

        const filterOptions: RootFilterQuery<WarehouseReceipt> = {};
        let sort = {};

        if (filter) {
            const {date, receiptNo, supplierTypeId, warehouseId, employeeId, sortBy, sortOrder } = filter;

            if (date) {
                filterOptions.date = {$regex: date, $options: 'i'};
            }

            if (receiptNo) {
                filterOptions.receiptNo = { $regex: receiptNo as string, $options: 'i' };
            }

            if(supplierTypeId){
                filterOptions.supplierTypeId = { $regex: supplierTypeId as string, $options: 'i' };
            }

            if(warehouseId){
                filterOptions.warehouseId = { $regex: warehouseId as string, $options: 'i' };
            }

            if(employeeId){
                filterOptions.employeeId = { $regex: employeeId as string, $options: 'i' };
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

        return{
            wareshouseReceipts : {
                total,
                page: pagination.page,
                limit: pagination.limit,
                warehouseReceipts,
            },
        };
    }

    // GET /warehouse-receipts/:id
    async findWarehouseById({ id}: { id: string }) {
      const warehouseReceiptExists = await this.findOne({
    filter: { _id: id } as RootFilterQuery<WarehouseReceipt>,
        });

        if(!warehouseReceiptExists) {
            throw new NotFoundException('Warehouse Receipt id not found');
        }
        return warehouseReceiptExists;
    }    
}