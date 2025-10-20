import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Deliverynote } from './schema/deliverynote.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import sortHelper from 'src/helpers/sort.helper';
import paginationHelper from 'src/helpers/pagination.helper';

@Injectable()
export class DeliveryNotesService extends BaseCrudService<Deliverynote> {
  constructor(
      private readonly deliverynoteTypesService: DeliveryNotesService,
      @InjectModel(Deliverynote.name) private deliverynoteModel: Model<Deliverynote>,
    ) {
      super(deliverynoteModel);
    }
}
