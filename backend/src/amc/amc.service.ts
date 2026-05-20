import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AmcService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AmcCreateInput) {
    return this.prisma.amc.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AmcWhereInput;
    orderBy?: Prisma.AmcOrderByWithRelationInput;
  }) {
    return this.prisma.amc.findMany({
      ...params,
      include: { orderItem: { include: { order: { include: { customer: true } } } } }
    });
  }

  async findOne(id: string) {
    const amc = await this.prisma.amc.findUnique({
      where: { id },
      include: { 
          orderItem: { include: { order: { include: { customer: true } } } }, 
          incidents: true 
      },
    });
    
    if (!amc) {
        throw new NotFoundException(`AMC with ID ${id} not found`);
    }
    return amc;
  }

  async update(id: string, data: Prisma.AmcUpdateInput) {
    return this.prisma.amc.update({
      where: { id },
      data,
    });
  }
}
