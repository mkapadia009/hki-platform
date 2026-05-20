import { Controller, Get, Post, Body, Put, Param, UseGuards, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Roles('ADMIN', 'OPS_EXEC')
  @Post()
  async create(@Body() createCustomerDto: Prisma.CustomerCreateInput) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const where = search ? {
      OR: [
        { companyName: { contains: search } },
        { email: { contains: search } },
        { phoneNumber: { contains: search } }
      ]
    } : {};
    return this.customersService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Roles('ADMIN', 'OPS_EXEC')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: Prisma.CustomerUpdateInput) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Roles('ADMIN', 'OPS_EXEC')
  @Post(':id/contacts')
  async addContact(@Param('id') id: string, @Body() createContactDto: Prisma.ContactCreateWithoutCustomerInput) {
      return this.customersService.addContact(id, createContactDto);
  }
}
