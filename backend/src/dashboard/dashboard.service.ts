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

    const incidents = await this.prisma.incident.findMany();
    const incidentsBySeverity = incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {} as any);
    const severityData = Object.keys(incidentsBySeverity).map(key => ({ name: key, value: incidentsBySeverity[key] }));

    const orders = await this.prisma.order.findMany();
    const ordersByMonth = orders.reduce((acc, order) => {
      const month = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as any);
    const ordersData = Object.keys(ordersByMonth).map(key => ({ name: key, Orders: ordersByMonth[key] }));

    return {
      kpis: {
        totalCustomers,
        totalOrders,
        activeAmcs,
        openIncidents
      },
      recentIncidents,
      severityData,
      ordersData
    };
  }
}
