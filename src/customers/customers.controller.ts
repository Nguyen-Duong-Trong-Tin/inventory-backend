import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CustomersService } from './customers.service';
import { CreateCustomerBodyDto } from './dto/create-customer.dto';
import { UpdateCustomerBodyDto } from './dto/update-customer.dto';
import { FindCustomersQueryDto } from './dto/find-customers.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createCustomer(@Body() body: CreateCustomerBodyDto) {
    return this.customersService.createCustomer({ body });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerBodyDto,
  ) {
    return this.customersService.updateCustomer({ id, body });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer({ id });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findCustomers(@Query() query: FindCustomersQueryDto) {
    return this.customersService.findCustomers({ query });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findCustomerById(@Param('id') id: string) {
    return this.customersService.findOne({ filter: { _id: id } });
  }
}
