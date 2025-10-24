import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { CreateEmployeeBodyDto } from './dto/create-employee.dto';
import { UpdateEmployeeBodyDto } from './dto/update-employee.dto';
import { FindEmployeesQueryDto } from './dto/find-employees.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import IEmployee from './interfaces/employee.interface';

@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createEmployee(@Body() body: CreateEmployeeBodyDto) {
    return this.employeesService.createEmployee({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateEmployee(
    @Param('id') id: string,
    @Body() body: UpdateEmployeeBodyDto,
  ) {
    return this.employeesService.updateEmployee({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEmployee(@Param('id') id: string) {
    return this.employeesService.deleteEmployee({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findEmployees(@Query() query: FindEmployeesQueryDto) {
    return this.employeesService.findEmployees({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findEmployeeById(@Param('id') id: string) {
    return this.employeesService.findOne({ filter: { _id: id } });
  }

  @Get('/get/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user as IEmployee;
  }
}
