import { Injectable } from '@nestjs/common';

import { BaseCrudService } from 'src/cores/base-crud.core';

import { Weight } from './schema/weight.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WeightsService extends BaseCrudService<Weight> {
  constructor(
    @InjectModel(Weight.name) private readonly weightModel: Model<Weight>,
  ) {
    super(weightModel);
  }

  async activeWeight({ id }: { id: string }) {
    await this.updateMany({
      filter: { active: true },
      update: { active: false },
    });

    await this.findOneAndUpdate({
      filter: { _id: id },
      update: { active: true },
    });

    return { status: true };
  }
}
