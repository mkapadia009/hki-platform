import { Controller, Get, Post, Body, Put, Param, UseGuards, Query } from '@nestjs/common';
import { AmcService } from './amc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('amcs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Roles('ADMIN', 'OPS_EXEC')
  @Post()
  async create(@Body() createAmcDto: Prisma.AmcCreateInput) {
    return this.amcService.create(createAmcDto);
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    const where = status ? { status } : {};
    return this.amcService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.amcService.findOne(id);
  }

  @Roles('ADMIN', 'OPS_EXEC')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAmcDto: Prisma.AmcUpdateInput) {
    return this.amcService.update(id, updateAmcDto);
  }
}
