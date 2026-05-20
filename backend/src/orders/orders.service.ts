import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }) {
    return this.prisma.order.findMany({
      ...params,
      include: { customer: true, items: true }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
          customer: true, 
          items: { include: { amcs: true, incidents: true } }, 
          incidents: true 
      },
    });
    
    if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
  
  async addItem(orderId: string, data: Prisma.OrderItemCreateWithoutOrderInput) {
      return this.prisma.orderItem.create({
          data: {
              ...data,
              order: { connect: { id: orderId } }
          }
      });
  }
}
