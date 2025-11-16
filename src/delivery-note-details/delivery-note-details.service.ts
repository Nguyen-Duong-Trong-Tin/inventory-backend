import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { DeliveryNoteDetail } from './schema/deliverynotedetail.schema';

import { LotsService } from 'src/lots/lots.service';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';
import { CreateDeliveryNoteDetailDto } from './dto/create-deliverynotedetail.dto';
import { UpdateDeliveryNoteDetailDto } from './dto/update-deliverynotedetail.dto';
import { FindDeliveryNoteDetailsQueryDto } from './dto/find-deliverynotedetails.dto';

@Injectable()
export class DeliveryNoteDetailsService extends BaseCrudService<DeliveryNoteDetail> {
  constructor(
    @InjectModel(DeliveryNoteDetail.name)
    private readonly deliveryNoteDetailModel: Model<DeliveryNoteDetail>,
    private readonly lotsService: LotsService,
    private readonly employeeService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(deliveryNoteDetailModel);
  }

  async createDeliveryNoteDetail({
    body,
    employee,
  }: {
    body: CreateDeliveryNoteDetailDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { deliveryNoteId, lotId, quantity, exportPrice } = body;

    const actor = await this.employeeService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role || !role.permisstion?.includes('create-delivery-note-detail')) {
      throw new UnauthorizedException('Permission denied');
    }

    const lot = await this.lotsService.findOne({ filter: { _id: lotId } });
    if (!lot) throw new NotFoundException('Lot not found');
    if (quantity > lot.quantity) {
      throw new BadRequestException('Quantity exceeds available lot quantity');
    }

    const maxLine = await this.deliveryNoteDetailModel
      .find({ deliveryNoteId })
      .sort({ lineNo: -1 })
      .limit(1);
    const lineNo = maxLine.length > 0 ? maxLine[0].lineNo + 1 : 1;

    const detail = await this.create({
      doc: { deliveryNoteId, lotId, quantity, exportPrice, lineNo },
    });

    await this.lotsService.findOneAndUpdate({
      filter: { _id: lotId },
      update: { $inc: { quantity: -quantity } },
    });

    return detail;
  }

  async updateDeliveryNoteDetail({
    id,
    body,
    employee,
  }: {
    id: string;
    body: UpdateDeliveryNoteDetailDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;
    const { lotId, quantity, exportPrice } = body;

    const actor = await this.employeeService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role || !role.permisstion?.includes('update-delivery-note-detail')) {
      throw new UnauthorizedException('Permission denied');
    }

    const existingDetail = await this.findOne({ filter: { _id: id } });
    if (!existingDetail) throw new NotFoundException('DeliveryNoteDetail not found');

    const lot = await this.lotsService.findOne({ filter: { _id: lotId } });
    if (!lot) throw new NotFoundException('Lot not found');

    const quantityDiff = quantity! - existingDetail.quantity;
    if (quantityDiff > lot.quantity) {
      throw new BadRequestException('Quantity exceeds available lot quantity');
    }

    const updatedDetail = await this.findOneAndUpdate({
      filter: { _id: id },
      update: { lotId, quantity, exportPrice },
    });

    await this.lotsService.findOneAndUpdate({
      filter: { _id: lotId },
      update: { $inc: { quantity: -quantityDiff } },
    });

    return updatedDetail;
  }

  async deleteDeliveryNoteDetail({
      id,
      employee,
    }: {
      id: string;
      employee: { userId: string; email: string };
    }) {
      const { userId } = employee;

      const actor = await this.employeeService.findOne({ filter: { _id: userId } });
      if (!actor) throw new UnauthorizedException('Employee not found');

      const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
      if (!role || !role.permisstion?.includes('delete-delivery-note-detail')) {
        throw new UnauthorizedException('Permission denied');
      }

      const detail = await this.findOne({ filter: { _id: id } });
      if (!detail) throw new NotFoundException('DeliveryNoteDetail not found');

      // ✅ Cộng lại số lượng vào Lô
      await this.lotsService.findOneAndUpdate({
        filter: { _id: detail.lotId },
        update: { $inc: { quantity: detail.quantity } },
      });

      return this.findOneAndDelete({ filter: { _id: id } });
    }

  async findDeliveryNoteDetails({
    query,
    employee,
  }: {
    query: FindDeliveryNoteDetailsQueryDto;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    const actor = await this.employeeService.findOne({ filter: { _id: userId } });
    if (!actor) throw new UnauthorizedException('Employee not found');

    const role = await this.roleService.findOne({ filter: { _id: actor.roleId } });
    if (!role || !role.permisstion?.includes('read-delivery-note-detail')) {
      throw new UnauthorizedException('Permission denied');
    }

    const { filter, page, limit } = query;
    const filterOptions: RootFilterQuery<DeliveryNoteDetail> = {};
    let sort = {};

    if (filter) {
      const { deliveryNoteId, lotId, lineNo, sortBy, sortOrder } = filter;
      if (deliveryNoteId) filterOptions.deliveryNoteId = { $regex: deliveryNoteId, $options: 'i' };
      if (lotId) filterOptions.lotId = { $regex: lotId, $options: 'i' };
      if (lineNo) filterOptions.lineNo = lineNo;
      sort = sortHelper(sortBy, sortOrder);
    }

    const pagination = paginationHelper(page, limit);

    const [details, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      deliveryNoteDetails: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        details,
      },
    };
  }

  async findOne({ filter }: { filter: RootFilterQuery<DeliveryNoteDetail> }) {
    const detail = await this.deliveryNoteDetailModel.findOne(filter);
    if (!detail) throw new NotFoundException('DeliveryNoteDetail not found');
    return detail;
  }
}