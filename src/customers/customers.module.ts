import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { EmployeesModule } from 'src/employees/employees.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),

    EmployeesModule,
    RolesModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
