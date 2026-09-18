import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomString = (length = 6) => Math.random().toString(36).substring(2, length + 2).toUpperCase();

const companies = [
  'Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 
  'Massive Dynamic', 'Umbrella Corp', 'Initech', 'Globex', 'Soylent Corp', 'Hooli'
];

const people = [
  'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis',
  'Diana Evans', 'Evan Foster', 'Fiona Green', 'George Harris', 'Hannah Irving'
];

const cities = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Mumbai', 'Toronto', 'Dubai', 'Singapore'];

const products = [
  { name: 'MacBook Pro M3', code: 'APP-MBP-M3', price: 2400 },
  { name: 'Dell XPS 15', code: 'DELL-XPS-15', price: 1800 },
  { name: 'ThinkPad X1 Carbon', code: 'LEN-X1', price: 1600 },
  { name: 'Cisco Meraki MR46', code: 'CIS-MR46', price: 800 },
  { name: 'HP ProLiant DL380', code: 'HP-DL380', price: 4500 },
  { name: 'Ubiquiti UniFi Dream Machine', code: 'UBI-UDM', price: 379 }
];

async function main() {
  console.log('Seeding extended demo data...');

  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@hki.com' } });
  if (!adminUser) {
    throw new Error('Admin user not found. Please run the initial seed first.');
  }

  // 1. Create Customers
  const createdCustomers: any[] = [];
  for (let i = 0; i < companies.length; i++) {
    const customer = await prisma.customer.create({
      data: {
        companyName: companies[i],
        contactPerson: people[i],
        phoneNumber: `+1-555-01${i.toString().padStart(2, '0')}`,
        email: `contact@${companies[i].replace(/\s+/g, '').toLowerCase()}.com`,
        address: `${Math.floor(Math.random() * 1000) + 1} Business Parkway`,
        city: cities[i],
        state: 'State',
        customerType: i % 3 === 0 ? 'Enterprise' : 'SMB',
        status: 'Active',
      }
    });
    createdCustomers.push(customer);
  }
  console.log(`Created ${createdCustomers.length} customers.`);

  // 2. Create Orders & Items
  const createdOrderItems: any[] = [];
  const createdOrders: any[] = [];
  for (let i = 0; i < 15; i++) {
    const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    
    const itemsData: any[] = [];
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      itemsData.push({
        productName: product.name,
        productCode: product.code,
        quantity: Math.floor(Math.random() * 10) + 1,
        unitPrice: product.price,
        serialNumber: `SN-${generateRandomString(8)}`,
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-2026-${generateRandomString(6)}`,
        customerId: customer.id,
        status: i % 4 === 0 ? 'In Progress' : 'Completed',
        paymentStatus: i % 3 === 0 ? 'Pending' : 'Paid',
        createdById: adminUser.id,
        items: {
          create: itemsData
        }
      },
      include: { items: true }
    });
    
    createdOrders.push(order);
    createdOrderItems.push(...order.items);
  }
  console.log(`Created ${createdOrders.length} orders.`);

  // 3. Create AMCs
  const createdAmcs: any[] = [];
  // Pick a random subset of order items to have AMCs
  const amcItems = createdOrderItems.sort(() => 0.5 - Math.random()).slice(0, 10);
  
  for (const item of amcItems) {
    const isExpired = Math.random() > 0.8;
    const amc = await prisma.amc.create({
      data: {
        orderItemId: item.id,
        startDate: isExpired ? new Date('2024-01-01') : new Date('2026-01-01'),
        endDate: isExpired ? new Date('2025-01-01') : new Date('2027-01-01'),
        coverageType: ['Full Coverage', 'Limited Coverage', 'Service Only'][Math.floor(Math.random() * 3)],
        status: isExpired ? 'Expired' : 'Active',
        slaType: '24x7',
        renewalStatus: isExpired ? 'Renewal Due' : 'Renewal Pending',
      }
    });
    createdAmcs.push({ amc, item });
  }
  console.log(`Created ${createdAmcs.length} AMCs.`);

  // 4. Create Incidents
  const incidentTypes = ['Hardware Issue', 'Software Issue', 'Network Issue', 'Other'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  for (let i = 0; i < 15; i++) {
    const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
    // Find an order for this customer if any
    const customerOrders = createdOrders.filter(o => o.customerId === customer.id);
    const order = customerOrders.length > 0 ? customerOrders[Math.floor(Math.random() * customerOrders.length)] : null;
    
    let orderItem: any = null;
    let amc: any = null;
    
    if (order && order.items.length > 0 && Math.random() > 0.5) {
      orderItem = order.items[Math.floor(Math.random() * order.items.length)];
      // find AMC for this item
      const linkedAmc = createdAmcs.find(a => a.item.id === orderItem!.id);
      if (linkedAmc) amc = linkedAmc.amc;
    }

    await prisma.incident.create({
      data: {
        customerId: customer.id,
        orderId: order?.id,
        orderItemId: orderItem?.id,
        amcId: amc?.id,
        incidentType: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `This is a generated test incident regarding ${orderItem ? orderItem.productName : 'general support'}. Customer reports intermittent issues.`,
        coveredUnderAmc: !!amc && amc.status === 'Active'
      }
    });
  }
  console.log('Created 15 Incidents.');

  console.log('Extended data seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
