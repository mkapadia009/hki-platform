import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  const roles = ['ADMIN', 'OPS_EXEC', 'SUPPORT_ENG', 'SALES', 'MANAGEMENT'];
  const createdRoles: Record<string, string> = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    createdRoles[roleName] = role.id;
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('demo123', salt);

  const users = [
    { email: 'ops@hki.com', firstName: 'Alice', lastName: 'Ops', roleId: createdRoles['OPS_EXEC'] },
    { email: 'support@hki.com', firstName: 'Bob', lastName: 'Support', roleId: createdRoles['SUPPORT_ENG'] },
    { email: 'sales@hki.com', firstName: 'Charlie', lastName: 'Sales', roleId: createdRoles['SALES'] },
  ];

  const createdUsers: Record<string, string> = {};
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password,
        firstName: u.firstName,
        lastName: u.lastName,
        roleId: u.roleId,
      },
    });
    createdUsers[u.email] = user.id;
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@hki.com' } });
  const adminId = admin ? admin.id : createdUsers['ops@hki.com'];

  // Customers
  const c1 = await prisma.customer.create({
    data: {
      companyName: 'Tech Solutions Inc',
      contactPerson: 'David Smith',
      phoneNumber: '555-0101',
      email: 'contact@techsolutions.demo',
      address: '123 Tech Park, Tower A',
      city: 'Bangalore',
      state: 'Karnataka',
      customerType: 'Enterprise',
      status: 'Active',
      contacts: {
        create: [
          { name: 'David Smith', email: 'david@techsolutions.demo', phone: '555-0101', designation: 'IT Director' },
          { name: 'Emma Watson', email: 'emma@techsolutions.demo', phone: '555-0102', designation: 'Procurement Manager' },
        ],
      },
    },
  });

  const c2 = await prisma.customer.create({
    data: {
      companyName: 'Global Logistics',
      contactPerson: 'Michael Johnson',
      phoneNumber: '555-0201',
      email: 'info@globallogistics.demo',
      address: '456 Warehouse Rd',
      city: 'Mumbai',
      state: 'Maharashtra',
      customerType: 'Mid-Market',
      status: 'Active',
      contacts: {
        create: [
          { name: 'Michael Johnson', email: 'michael@globallogistics.demo', phone: '555-0201', designation: 'Operations Head' },
        ],
      },
    },
  });

  const c3 = await prisma.customer.create({
    data: {
      companyName: 'Apex Manufacturing',
      contactPerson: 'Sarah Connor',
      phoneNumber: '555-0301',
      email: 'sarah@apex.demo',
      address: '789 Industrial Estate',
      city: 'Pune',
      state: 'Maharashtra',
      customerType: 'SMB',
      status: 'Active',
      contacts: {
        create: [
          { name: 'Sarah Connor', email: 'sarah@apex.demo', phone: '555-0301', designation: 'Factory Manager' },
        ],
      },
    },
  });

  // Orders and OrderItems
  const o1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-001',
      customerId: c1.id,
      status: 'Completed',
      paymentStatus: 'Paid',
      createdById: adminId,
      items: {
        create: [
          {
            productName: 'Dell PowerEdge R740 Server',
            productCode: 'DELL-R740',
            quantity: 2,
            serialNumber: 'SN-DELL-1001',
            unitPrice: 5000.0,
            amcEligible: true,
            warrantyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
          {
            productName: 'Cisco Catalyst 9300 Switch',
            productCode: 'CISCO-9300',
            quantity: 1,
            serialNumber: 'SN-CISCO-2001',
            unitPrice: 3500.0,
            amcEligible: true,
            warrantyEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          },
        ],
      },
    },
    include: { items: true },
  });

  const o2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-002',
      customerId: c2.id,
      status: 'In Progress',
      paymentStatus: 'Partially Paid',
      createdById: createdUsers['sales@hki.com'],
      items: {
        create: [
          {
            productName: 'Lenovo ThinkPad T14',
            productCode: 'LEN-T14',
            quantity: 50,
            unitPrice: 1200.0,
            amcEligible: true,
          },
        ],
      },
    },
    include: { items: true },
  });

  // AMC Creation for o1 items
  const amc1 = await prisma.amc.create({
    data: {
      orderItemId: o1.items[0].id,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      coverageType: 'Full Coverage',
      status: 'Active',
      slaType: '24x7',
      renewalStatus: 'Renewal Pending',
    },
  });

  const amc2 = await prisma.amc.create({
    data: {
      orderItemId: o1.items[1].id,
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      coverageType: 'Limited Coverage',
      status: 'Expired',
      slaType: '8x5',
      renewalStatus: 'Renewal Due',
    },
  });

  // Incidents
  await prisma.incident.create({
    data: {
      customerId: c1.id,
      orderId: o1.id,
      orderItemId: o1.items[0].id,
      amcId: amc1.id,
      incidentType: 'Hardware Issue',
      severity: 'Critical',
      status: 'In Progress',
      description: 'Server unexpected reboot issue reported in cluster node 1.',
      assignedUserId: createdUsers['support@hki.com'],
      coveredUnderAmc: true,
      comments: {
        create: [
          { userId: adminId, comment: 'Customer called and reported downtime. Need immediate action.' },
          { userId: createdUsers['support@hki.com'], comment: 'Checking the server logs remotely.' },
        ],
      },
    },
  });

  await prisma.incident.create({
    data: {
      customerId: c1.id,
      orderId: o1.id,
      orderItemId: o1.items[1].id,
      amcId: amc2.id,
      incidentType: 'Network Issue',
      severity: 'Medium',
      status: 'Open',
      description: 'Switch port 4 showing intermittent connectivity drops.',
      coveredUnderAmc: false, // Expired AMC
      comments: {
        create: [
          { userId: createdUsers['ops@hki.com'], comment: 'Notified customer that AMC is expired for this item.' },
        ],
      },
    },
  });

  await prisma.incident.create({
    data: {
      customerId: c2.id,
      orderId: o2.id,
      incidentType: 'Other',
      severity: 'Low',
      status: 'Closed',
      description: 'Delivery tracking inquiry for the bulk laptop order.',
      assignedUserId: createdUsers['sales@hki.com'],
      resolutionNotes: 'Provided tracking numbers and expected ETA.',
      closedDate: new Date(),
    },
  });

  console.log('Successfully seeded demo data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
