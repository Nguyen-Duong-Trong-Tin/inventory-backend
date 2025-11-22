import * as PDFDocument from 'pdfkit';
import { Model, RootFilterQuery } from 'mongoose';

import {
  forwardRef,
  Inject,
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
import { ProductsService } from 'src/products/products.service';
import { LotsService } from 'src/lots/lots.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { ProductTypesService } from 'src/product-types/product-types.service';

@Injectable()
export class WarehouseReceiptsService extends BaseCrudService<WarehouseReceipt> {
  constructor(
    @InjectModel(WarehouseReceipt.name)
    private readonly warehouseReceiptModel: Model<WarehouseReceipt>,

    @Inject(forwardRef(() => LotsService))
    private readonly lotsService: LotsService,

    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
    private readonly warehousesService: WarehousesService,
    private readonly productsService: ProductsService,
    private readonly productTypesService: ProductTypesService,
    private readonly suppliersService: SuppliersService,
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

  async getReceiptItems(receiptId: string) {
    const receipt = await this.findWarehouseById({ id: receiptId });

    const lots = await this.lotsService.findLotsByReceiptId(receiptId);
    if (!lots || lots.length === 0) {
      throw new Error('Không có lô hàng nào trong phiếu nhập');
    }

    const supplier = await this.suppliersService.findSupplierById({
      id: receipt.supplierId,
    });

    const items = await Promise.all(
      lots.map(async (lot) => {
        const product = await this.productsService.findProductById({
          id: lot.productId,
        });

        // Lấy productType nếu có product
        let productTypeName = 'Chưa có loại sản phẩm';
        if (product?.productTypeId) {
          const productType =
            await this.productTypesService.findProductTypeById({
              id: product.productTypeId,
            });
          productTypeName = productType?.name || productTypeName;
        }

        return {
          name: product?.name || 'Chưa có tên sản phẩm',
          quantity: lot.quantity,
          price: lot.importPrice,
          supplierName: supplier?.name || 'Chưa có nhà cung cấp',
          productTypeName, // thêm tên loại sản phẩm vào kết quả
        };
      }),
    );

    const employee = await this.employeesService.findEmployeeById({
      id: receipt.employeeId,
    });
    const warehouse = await this.warehousesService.findWarehouseById({
      id: receipt.warehouseId,
    });
    const productTypeNames = items.map((item) => item.productTypeName);

    return {
      receiptNumber: receipt.receiptNo,
      date: receipt.date,
      employeeName: employee?.name || '',
      warehouseName: warehouse?.name || '',
      supplierName: supplier?.name || '',
      productTypeNames,
      items,
    };
  }

  async generateReceiptPDF(receiptId: string): Promise<Buffer> {
    const data = await this.getReceiptItems(receiptId); // dùng id truyền vào

    // Format ngày dd/mm/yyyy
    const dateObj = new Date(data.date);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });

      // ==== ĐĂNG KÝ FONT UNICODE ====
      doc.registerFont(
        'Roboto',
        'src/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf',
      );
      doc.registerFont(
        'Roboto-Bold',
        'src/fonts/Roboto-VariableFont_wdth,wght.ttf',
      );

      // ==== HEADER ====
      doc
        .font('Roboto-Bold')
        .fontSize(20)
        .text('PHIẾU NHẬP HÀNG', { align: 'center' });
      doc.moveDown();
      doc
        .font('Roboto')
        .fontSize(12)
        .text(`Số phiếu: ${data.receiptNumber}`)
        .text(`Ngày nhập: ${formattedDate}`)
        .text(`Nhân viên nhập: ${data.employeeName}`)
        .text(`Kho: ${data.warehouseName}`)
        .text(`Nhà cung cấp: ${data.supplierName}`);
      doc.moveDown(2);

      // ==== TABLE HEADER ====
      const startX = 50;
      const startY = doc.y;
      const rowHeight = 20;

      doc.font('Roboto-Bold');
      doc.text('STT', startX, startY, { width: 50 });
      doc.text('Tên sản phẩm', startX + 50, startY, { width: 200 });
      doc.text('Số lượng', startX + 250, startY, { width: 100 });
      doc.text('Đơn giá', startX + 350, startY, { width: 100 });
      doc.text('Loại sản phẩm', startX + 450, startY, { width: 100 }); // sửa lại tiêu đề cho đúng
      doc.font('Roboto');

      // ==== TABLE CONTENT ====
      let total = 0;
      let currentY = startY + rowHeight;

      data.items.forEach((item, index) => {
        const itemTotal = item.quantity * item.price;
        total += itemTotal;

        doc.text(`${index + 1}`, startX, currentY, { width: 50 });
        doc.text(item.name, startX + 50, currentY, { width: 200 });
        doc.text(`${item.quantity}`, startX + 250, currentY, { width: 100 });
        doc.text(`${item.price.toLocaleString()} ₫`, startX + 350, currentY, {
          width: 100,
        });
        doc.text(`${item.productTypeName}`, startX + 450, currentY, {
          width: 100,
        });

        currentY += rowHeight;
      });

      // ==== TOTAL ====
      doc.font('Roboto-Bold');
      doc.text(
        `Tổng tiền: ${total.toLocaleString()} ₫`,
        startX + 350,
        currentY + 5,
        { align: 'right' },
      );

      doc.end();

      const buffer: Uint8Array[] = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffer)));
    });

    return pdfBuffer;
  }
}
