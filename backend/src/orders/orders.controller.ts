import { Controller, Get, Post, Body, Put, Param, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('ADMIN', 'OPS_EXEC')
  @Post()
  async create(@Body() createOrderDto: Prisma.OrderCreateInput) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    const where = search ? {
        orderNumber: { contains: search }
    } : {};
    return this.ordersService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('ADMIN', 'OPS_EXEC')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: Prisma.OrderUpdateInput) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Roles('ADMIN', 'OPS_EXEC')
  @Post(':id/items')
  async addItem(@Param('id') id: string, @Body() createItemDto: Prisma.OrderItemCreateWithoutOrderInput) {
      return this.ordersService.addItem(id, createItemDto);
  }
}
