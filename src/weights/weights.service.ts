import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { BaseCrudService } from 'src/cores/base-crud.core';
import { Weight } from './schema/weight.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class WeightsService extends BaseCrudService<Weight> {
  constructor(
    @InjectModel(Weight.name) private readonly weightModel: Model<Weight>,
    private readonly employeesService: EmployeesService,
    private readonly roleService: RolesService,
  ) {
    super(weightModel);
  }

  // PATCH /weights/:id/active
  async activeWeight({
    id,
    employee,
  }: {
    id: string;
    employee: { userId: string; email: string };
  }) {
    const { userId } = employee;

    // 1. Kiểm tra employee tồn tại
    const actor = await this.employeesService.findOne({
      filter: { _id: userId },
    });
    if (!actor) throw new UnauthorizedException('Employee id not found');

    // 2. Kiểm tra role tồn tại
    const role = await this.roleService.findOne({
      filter: { _id: actor.roleId },
    });
    if (!role) throw new UnauthorizedException('Role id not found');

    // 3. Kiểm tra quyền
    if (!role.permisstion?.includes('active-weight')) {
      throw new UnauthorizedException(
        'You don’t have permission to activate weights',
      );
    }

    // 4. Thực hiện logic active
    await this.updateMany({
      filter: { active: true },
      update: { active: false },
    });

    const updatedWeight = await this.findOneAndUpdate({
      filter: { _id: id } as RootFilterQuery<Weight>,
      update: { active: true },
    });

    if (!updatedWeight) {
      throw new NotFoundException('Weight id not found');
    }

    return { status: true };
  }
}