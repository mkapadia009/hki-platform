import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.IncidentCreateInput) {
    return this.prisma.incident.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.IncidentWhereInput;
    orderBy?: Prisma.IncidentOrderByWithRelationInput;
  }) {
    return this.prisma.incident.findMany({
      ...params,
      include: { customer: true, assignedUser: true, amc: true }
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: { 
          customer: true, 
          assignedUser: true,
          amc: true,
          orderItem: true,
          comments: true
      },
    });
    
    if (!incident) {
        throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }

  async update(id: string, data: Prisma.IncidentUpdateInput) {
    return this.prisma.incident.update({
      where: { id },
      data,
    });
  }
  
  async addComment(incidentId: string, userId: string, comment: string) {
      return this.prisma.incidentComment.create({
          data: {
              incidentId,
              userId,
              comment
          }
      });
  }
}
