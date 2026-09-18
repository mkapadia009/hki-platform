const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.updateMany({
    where: { email: { in: ['admin@hki.com', 'client@example.com'] } },
    data: { password: hash }
  });
  console.log("Passwords updated to password123");
}
main().catch(console.error).finally(() => prisma.$disconnect());
