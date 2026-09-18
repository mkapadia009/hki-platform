import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding customer user...');

  // Ensure CUSTOMER role exists
  const role = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      permissions: JSON.stringify(['READ_OWN_INCIDENTS', 'CREATE_INCIDENT'])
    }
  });

  // Pick a random customer from the DB to link
  const customer = await prisma.customer.findFirst({
    where: { status: 'Active' }
  });

  if (!customer) {
    throw new Error('No active customers found. Run demo-seed.ts first.');
  }

  // Create the customer user
  const hashedPassword = await bcrypt.hash('customer123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {
      password: hashedPassword,
      roleId: role.id,
      customerId: customer.id
    },
    create: {
      email: 'client@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'Client',
      roleId: role.id,
      customerId: customer.id
    }
  });

  console.log('Customer seeded successfully!');
  console.log(`Email: client@example.com`);
  console.log(`Password: customer123`);
  console.log(`Linked Company: ${customer.companyName}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
