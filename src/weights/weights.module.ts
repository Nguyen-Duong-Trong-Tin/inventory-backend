import { Module } from '@nestjs/common';
import { WeightsService } from './weights.service';
import { WeightsController } from './weights.controller';
import { Weight, WeightSchema } from './schema/weight.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from 'src/roles/roles.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weight.name, schema: WeightSchema }]),
    EmployeesModule,
    RolesModule,
  ],
  controllers: [WeightsController],
  providers: [WeightsService],
  exports: [WeightsService],
})
export class WeightsModule {}
