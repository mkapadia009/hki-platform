import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('adminpassword', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hki.com' },
    update: {},
    create: {
      email: 'admin@hki.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
    },
  });

  console.log('Seeded admin:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
