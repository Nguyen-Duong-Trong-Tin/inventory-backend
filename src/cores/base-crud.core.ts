import { Model, UpdateQuery, SortOrder, FilterQuery } from 'mongoose';

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseCrudService<T> {
  constructor(protected readonly model: Model<T>) {}

  async create({ doc }: { doc: Partial<T> }) {
    const newDoc = new this.model(doc);
    return await newDoc.save();
  }

  async countDocuments({ filter }: { filter: FilterQuery<T> }) {
    return await this.model.countDocuments(filter);
  }

  async find({
    filter,
    select,
    sort,
    skip,
    limit,
  }: {
    filter: FilterQuery<T>;
    select?: string;
    sort?: { [key: string]: SortOrder };
    skip?: number;
    limit?: number;
  }) {
    return await this.model
      .find(filter)
      .select(select || '')
      .sort(sort)
      .skip(skip || 0)
      .limit(limit || 20);
  }

  async findOne({ filter }: { filter: FilterQuery<T> }) {
    return this.model.findOne(filter);
  }

  async findOneAndUpdate({
    filter,
    update,
  }: {
    filter: FilterQuery<T>;
    update: UpdateQuery<T>;
  }) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
  }

  async findOneAndDelete({ filter }: { filter: FilterQuery<T> }) {
    return this.model.findOneAndDelete(filter);
  }

  async updateMany({
    filter,
    update,
  }: {
    filter: FilterQuery<T>;
    update: UpdateQuery<T>;
  }) {
    return this.model.updateMany(filter, update);
  }
}
