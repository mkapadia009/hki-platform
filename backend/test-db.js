const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.customer.count();
  console.log("Customers in DB:", count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
