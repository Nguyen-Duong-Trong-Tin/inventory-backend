import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { ProductsService } from 'src/products/products.service';
import { Lot } from './schema/lot.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { CreateLotBodyDto } from './dto/create-lot.dto';
import { WarehouseReceiptsService } from 'src/warehouse-receipts/warehouse-receipts.service';
import { UpdateLotBodyDto } from './dto/update-lot.dto';
import { FindLotsQueryDto } from './dto/find-lots.dto';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class LotsService extends BaseCrudService<Lot> {
  constructor(
    private readonly productsService: ProductsService,
    private readonly warehouseReceiptsService: WarehouseReceiptsService,
    @InjectModel(Lot.name)
    private lotModel: Model<Lot>,
  ) {
    super(lotModel);
  }

  // POST /lots
  async createLot({ body }: { body: CreateLotBodyDto }) {
    const {
      lotNumber,
      manufactureDate,
      expiryDate,
      productId,
      warehouseReceiptId,
    } = body;

    //Check productId
    const productsExists = await this.productsService.findOne({
      filter: { _id: productId },
    });
    if (!productsExists) {
      throw new NotFoundException('Product id not found');
    }

    //Check warehouseReceiptId
    const warehouseReceiptsExists = await this.warehouseReceiptsService.findOne(
      {
        filter: { _id: warehouseReceiptId },
      },
    );
    if (!warehouseReceiptsExists) {
      throw new NotFoundException('WarehouseReceipt id not found');
    }

    if (new Date(expiryDate) <= new Date(manufactureDate)) {
      throw new BadRequestException(
        'Expiry date must be after manufacture date',
      );
    }

    return await this.create({
      doc: {
        lotNumber,
        manufactureDate: new Date(manufactureDate),
        expiryDate: new Date(expiryDate),
        productId,
        warehouseReceiptId,
      },
    });
  }

  // PATCH /lots/:id
  async updateLot({ id, body }: { id: string; body: UpdateLotBodyDto }) {
    const {
      lotNumber,
      manufactureDate,
      expiryDate,
      productId,
      warehouseReceiptId,
    } = body;

    //Check productId
    const productsExists = await this.productsService.findOne({
      filter: { _id: productId },
    });
    if (!productsExists) {
      throw new NotFoundException('Product id not found');
    }

    //Check warehouseReceiptId
    const warehouseReceiptsExists = await this.warehouseReceiptsService.findOne(
      {
        filter: { _id: warehouseReceiptId },
      },
    );
    if (!warehouseReceiptsExists) {
      throw new NotFoundException('WarehouseReceipt id not found');
    }

    // Validate date logic
    if (manufactureDate && expiryDate) {
      if (new Date(expiryDate) <= new Date(manufactureDate)) {
        throw new BadRequestException(
          'Expiry date must be after manufacture date',
        );
      }
    }

    const newLot = await this.findOneAndUpdate({
      filter: { _id: id },
      update: {
        lotNumber,
        manufactureDate,
        expiryDate,
        productId,
        warehouseReceiptId,
      },
    });
    if (!newLot) {
      throw new NotFoundException('Lot id not found');
    }

    return newLot;
  }

  // DELETE /lot/:id
  async deleteLot({ id }: { id: string }) {
    const deletedLot = await this.findOneAndDelete({
      filter: { _id: id } as RootFilterQuery<Lot>,
    });

    if (!deletedLot) {
      throw new NotFoundException('Lot id not found');
    }

    return deletedLot;
  }

  // GET /lots
  async findLots({ query }: { query: FindLotsQueryDto }) {
    const { filter, page, limit } = query;

    const filterOptions: RootFilterQuery<Lot> = {};
    let sort = {};

    if (filter) {
      const {
        lotNumber,
        manufactureDate,
        expiryDate,
        productId,
        warehouseReceiptId,
        sortBy,
        sortOrder,
      } = filter;

      if (lotNumber !== undefined) {
        filterOptions.lotNumber = Number(lotNumber);
      }

      if (manufactureDate) {
        filterOptions.manufactureDate = new Date(manufactureDate);
      }

      if (expiryDate) {
        filterOptions.expiryDate = new Date(expiryDate);
      }

      if (productId) {
        filterOptions.productId = { $regex: productId, $options: 'i' };
      }

      if (warehouseReceiptId) {
        filterOptions.warehouseReceiptId = {
          $regex: warehouseReceiptId,
          $options: 'i',
        };
      }

      sort = sortHelper(sortBy as string, sortOrder as string);
    }

    const pagination = paginationHelper(page, limit);

    const [lots, total] = await Promise.all([
      this.find({
        filter: filterOptions,
        skip: pagination.skip,
        limit: pagination.limit,
        sort,
      }),
      this.countDocuments({ filter: filterOptions }),
    ]);

    return {
      lots: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        lots,
      },
    };
  }

  // GET /lots/:id
  async findLotById({ id }: { id: string }) {
    const lotExists = await this.findOne({
      filter: { _id: id } as RootFilterQuery<Lot>,
    });

    if (!lotExists) {
      throw new NotFoundException('Lot id not found');
    }

    return lotExists;
  }
}
