import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const totalCustomers = await this.prisma.customer.count();
    const totalOrders = await this.prisma.order.count();
    const activeAmcs = await this.prisma.amc.count({ where: { status: 'Active' } });
    const openIncidents = await this.prisma.incident.count({ 
        where: { 
            status: { in: ['Open', 'Assigned', 'In Progress'] } 
        } 
    });
    
    const recentIncidents = await this.prisma.incident.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });

    return {
      kpis: {
        totalCustomers,
        totalOrders,
        activeAmcs,
        openIncidents
      },
      recentIncidents
    };
  }
}
