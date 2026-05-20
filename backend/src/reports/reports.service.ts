import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
const pdfmake = require('pdfmake');
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateCustomerServiceReport(customerId: string): Promise<Buffer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: { include: { items: { include: { amcs: true } } } },
        incidents: true
      }
    });

    if (!customer) throw new NotFoundException('Customer not found');

    const fonts = {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
      }
    };

    pdfmake.fonts = fonts;
    const docDefinition: TDocumentDefinitions = {
      defaultStyle: {
        font: 'Helvetica'
      },
      content: [
        { text: 'Hare Krishna Infotech', style: 'companyHeader', alignment: 'center' },
        { text: 'Customer Service Report', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
        
        { text: 'Customer Details', style: 'subheader' },
        { text: `Company: ${customer.companyName}` },
        { text: `Contact: ${customer.contactPerson}` },
        { text: `Email: ${customer.email}` },
        { text: `Phone: ${customer.phoneNumber}`, margin: [0, 0, 0, 20] },
        
        { text: 'Orders Summary', style: 'subheader' },
        customer.orders.length > 0 ? {
          ul: customer.orders.map(o => `Order ${o.orderNumber} - ${o.status} (${new Date(o.orderDate).toLocaleDateString()})`)
        } : { text: 'No orders found.' },
        
        { text: 'Service Incidents', style: 'subheader', margin: [0, 20, 0, 5] },
        customer.incidents.length > 0 ? {
          ul: customer.incidents.map(i => `[${i.status}] ${i.incidentType} - ${new Date(i.openedDate).toLocaleDateString()}`)
        } : { text: 'No service incidents found.' }
      ],
      styles: {
        companyHeader: { fontSize: 24, bold: true, color: '#2563eb' },
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5], color: '#374151' }
      }
    };

    const pdfDoc = pdfmake.createPdf(docDefinition);
    return pdfDoc.getBuffer();
  }
}
