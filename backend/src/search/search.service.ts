import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string) {
    if (!query) return { customers: [], orders: [], incidents: [] };
    
    const customers = await this.prisma.customer.findMany({
      where: {
        OR: [
          { companyName: { contains: query } },
          { contactPerson: { contains: query } },
          { email: { contains: query } }
        ]
      },
      take: 5
    });

    const orders = await this.prisma.order.findMany({
      where: { orderNumber: { contains: query } },
      take: 5
    });

    const incidents = await this.prisma.incident.findMany({
      where: {
        OR: [
          { description: { contains: query } },
          { incidentType: { contains: query } }
        ]
      },
      take: 5
    });

    return { customers, orders, incidents };
  }
}
