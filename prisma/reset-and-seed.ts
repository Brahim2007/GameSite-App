import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing data...');

  // Delete in correct order (respecting foreign keys)
  await prisma.entry.deleteMany();
  await prisma.dailyReset.deleteMany();
  
  console.log('✅ Data cleared');
  console.log('');
  console.log('🌱 Re-seeding database...');
  console.log('Please run: npm run db:seed');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

