import { Controller, Get, Post, Body, Put, Param, UseGuards, Query, Request } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('incidents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Roles('ADMIN', 'OPS_EXEC', 'SUPPORT_ENG')
  @Post()
  async create(@Body() createIncidentDto: Prisma.IncidentCreateInput) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    const where = status ? { status } : {};
    return this.incidentsService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Roles('ADMIN', 'OPS_EXEC', 'SUPPORT_ENG')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateIncidentDto: Prisma.IncidentUpdateInput) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Roles('ADMIN', 'OPS_EXEC', 'SUPPORT_ENG')
  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() body: { comment: string }, @Request() req) {
      return this.incidentsService.addComment(id, req.user.userId, body.comment);
  }
}
