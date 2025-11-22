import * as PDFDocument from 'pdfkit';
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
import { ProductsService } from 'src/products/products.service';
import { ProductTypesService } from 'src/product-types/product-types.service';
import { LotsService } from 'src/lots/lots.service';
import { DeliveryNoteDetailsService } from 'src/delivery-note-details/delivery-note-details.service';

@Injectable()
export class DeliveryNotesService extends BaseCrudService<DeliveryNote> {
  constructor(
    private readonly warehouseService: WarehousesService,
    private readonly lotService: LotsService,
    private readonly employeeService: EmployeesService,
    private readonly customerService: CustomersService,
    private readonly roleService: RolesService,
    private readonly productsService: ProductsService,
    private readonly deliveryNoteDetailsService: DeliveryNoteDetailsService,
    private readonly productTypesService: ProductTypesService,
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

  // async getDeliveryNoteItems(deliveryNoteId: string) {
  //   const deliveryNote = await this.findDeliveryNoteById({ id: deliveryNoteId });

  //   const deliveryNoteDetails = await this.deliveryNoteDetailsService.findMany({
  //     filter: { deliveryNoteId },
  //   });

  //   if (!deliveryNoteDetails || deliveryNoteDetails.length === 0) {
  //     throw new Error('Không có chi tiết nào trong hóa đơn xuất');
  //   }

  //   const customer = await this.customerService.findCustomerById({ id: deliveryNote.customerId });
  //   const employee = await this.employeeService.findEmployeeById({ id: deliveryNote.employeeId });

  //   const items = await Promise.all(
  //       deliveryNoteDetails.map(async (detail) => {
  //         const lots = await this.lotService.findLotById({ id: detail.lotId.toString() });

  //         if (!lots) {
  //           throw new Error(`Không có lô hàng nào cho chi tiết hóa đơn ${detail._id}`);
  //         }

  //         const lot = lots[0]; // nếu mỗi detail chỉ có 1 lot, hoặc bạn có thể lặp qua tất cả lots nếu cần
  //         const product = await this.productsService.findProductById({ id: lot.productId });

  //         let productTypeName = 'Chưa có loại sản phẩm';
  //         if (product?.productTypeId) {
  //           const productType = await this.productTypesService.findProductTypeById({ id: product.productTypeId });
  //           productTypeName = productType?.name || productTypeName;
  //         }

  //         return {
  //           name: product?.name || 'Chưa có tên sản phẩm',
  //           quantity: detail.quantity,
  //           customerName: customer?.name || 'Chưa có khách hàng',
  //           productTypeName,
  //           price: detail.exportPrice,
  //         };
  //       })
  //     );

  //     return {
  //       deliveryNoteNumber: deliveryNote.deliveryNo,
  //       date: deliveryNote.date,
  //       employeeName: employee?.name || '',
  //       customerName: customer?.name || '',
  //       productTypeNames: items.map((item) => item.productTypeName),
  //       items,
  //     };
  //   }

  async getDeliveryNoteItems(deliveryNoteId: string) {
    const deliveryNote = await this.findDeliveryNoteById({
      id: deliveryNoteId,
    });

    const deliveryNoteDetails = await this.deliveryNoteDetailsService.findMany({
      filter: { deliveryNoteId },
    });

    if (!deliveryNoteDetails || deliveryNoteDetails.length === 0) {
      throw new Error('Không có chi tiết nào trong hóa đơn xuất');
    }

    const customer = await this.customerService.findCustomerById({
      id: deliveryNote.customerId,
    });
    const employee = await this.employeeService.findEmployeeById({
      id: deliveryNote.employeeId,
    });

    const items = await Promise.all(
      deliveryNoteDetails.map(async (detail) => {
        const lot = await this.lotService.findLotById({
          id: detail.lotId.toString(),
        });

        if (!lot) {
          throw new Error(
            `Không có lô hàng nào cho chi tiết hóa đơn ${detail._id}`,
          );
        }

        const product = await this.productsService.findProductById({
          id: lot.productId,
        });

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
          quantity: detail.quantity,
          customerName: customer?.name || 'Chưa có khách hàng',
          productTypeName,
          price: detail.exportPrice,
        };
      }),
    );

    return {
      deliveryNoteNumber: deliveryNote.deliveryNo,
      date: deliveryNote.date,
      employeeName: employee?.name || '',
      customerName: customer?.name || '',
      productTypeNames: items.map((item) => item.productTypeName),
      items,
    };
  }

  async generateDeliveryNotePDF(deliveryNoteId: string): Promise<Buffer> {
    const data = await this.getDeliveryNoteItems(deliveryNoteId);

    const dateObj = new Date(data.date);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'LETTER', bufferPages: true });

      // ==== FONT ====
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
        .text('HÓA ĐƠN XUẤT KHO', { align: 'center' });
      doc.moveDown();
      doc
        .font('Roboto')
        .fontSize(12)
        .text(`Số hóa đơn: ${data.deliveryNoteNumber}`)
        .text(`Ngày xuất: ${formattedDate}`)
        .text(`Nhân viên xuất: ${data.employeeName}`)
        .text(`Khách hàng: ${data.customerName}`);
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
      doc.text('Loại sản phẩm', startX + 450, startY, { width: 100 });
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
