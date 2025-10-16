import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CustomersService } from './customers.service';
import { CreateCustomerBodyDto } from './dto/create-customer.dto';
import { UpdateCustomerBodyDto } from './dto/update-customer.dto';
import { FindCustomersQueryDto } from './dto/find-customers.dto';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('/')
  async createCustomer(@Body() body: CreateCustomerBodyDto) {
    return this.customersService.createCustomer({ body });
  }

  @Patch('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerBodyDto,
  ) {
    return this.customersService.updateCustomer({ id, body });
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string) {
    return this.customersService.deleteCustomer({ id });
  }
  
  @Get('/')
  async findCustomers(@Query() query: FindCustomersQueryDto) {
    return this.customersService.findCustomers({ query });
  }
  
  @Get('/:id')
  async findCustomerById(@Param('id') id: string) {
    return this.customersService.findOne({ filter: { _id: id } });
  }
}
