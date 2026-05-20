import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles('ADMIN', 'OPS_EXEC', 'SALES', 'MANAGEMENT')
  @Get('customer/:id/pdf')
  async getCustomerReport(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportsService.generateCustomerServiceReport(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=customer-report-${id}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
