import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(userId: string, action: string, entityType: string, entityId: string, details?: any) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        newValue: details ? JSON.stringify(details) : undefined,
      },
    });
  }

  async getLogs(params: { skip?: number; take?: number } = { take: 50 }) {
    return this.prisma.activityLog.findMany({
      ...params,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
