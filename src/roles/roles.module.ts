import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    forwardRef(() => EmployeesModule), // fix loop
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}