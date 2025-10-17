import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.entry.deleteMany();
  await prisma.user.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.dailyReset.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('admin', 10);
  const hashedPassword2 = await bcrypt.hash('reception1', 10);
  const hashedPassword3 = await bcrypt.hash('reception2', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'أحمد محمد',
      role: 'ADMIN',
    },
  });

  const reception1 = await prisma.user.create({
    data: {
      username: 'reception1',
      password: hashedPassword2,
      name: 'فاطمة علي',
      role: 'RECEPTION',
    },
  });

  const reception2 = await prisma.user.create({
    data: {
      username: 'reception2',
      password: hashedPassword3,
      name: 'محمود حسن',
      role: 'RECEPTION',
    },
  });

  console.log('✅ Users created');

  // Create settings
  await prisma.settings.create({
    data: {
      key: 'defaultPrice',
      value: '50',
      updatedBy: admin.name,
    },
  });

  await prisma.settings.create({
    data: {
      key: 'businessName',
      value: 'مدينة الألعاب الترفيهية',
      updatedBy: admin.name,
    },
  });

  await prisma.settings.create({
    data: {
      key: 'currency',
      value: 'ريال',
      updatedBy: admin.name,
    },
  });

  console.log('✅ Settings created');

  // Create sample entries for multiple days (last 10 days)
  const today = new Date();
  const users = [admin, reception1, reception2];

  console.log('📝 Creating entries for the last 10 days...');

  for (let dayOffset = 9; dayOffset >= 0; dayOffset--) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - dayOffset);
    
    // Create 8-15 entries per day
    const entriesCount = Math.floor(Math.random() * 8) + 8;
    
    for (let i = 0; i < entriesCount; i++) {
      const entryDate = new Date(targetDate);
      entryDate.setHours(9 + Math.floor(i / 2), (i % 2) * 30, 0);
      
      const numberOfCustomers = Math.floor(Math.random() * 5) + 1;
      const pricePerPerson = 50;
      
      await prisma.entry.create({
        data: {
          serialNumber: i + 1,
          numberOfCustomers,
          pricePerPerson,
          totalAmount: numberOfCustomers * pricePerPerson,
          date: entryDate,
          userId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
    }
    
    console.log(`  ✓ Created ${entriesCount} entries for ${targetDate.toLocaleDateString('ar-SA')}`);
  }

  console.log('✅ Sample entries created for 10 days');

  // Create daily reset record for today
  await prisma.dailyReset.create({
    data: {
      resetDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      lastSerialNumber: 15,
    },
  });

  console.log('✅ Daily reset record created');
  
  // Display summary
  const totalEntries = await prisma.entry.count();
  const totalCustomers = await prisma.entry.aggregate({
    _sum: {
      numberOfCustomers: true,
    },
  });
  const totalAmount = await prisma.entry.aggregate({
    _sum: {
      totalAmount: true,
    },
  });
  
  console.log('\n📊 Summary:');
  console.log(`  - Total entries: ${totalEntries}`);
  console.log(`  - Total customers: ${totalCustomers._sum.numberOfCustomers}`);
  console.log(`  - Total amount: ${totalAmount._sum.totalAmount} ريال`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

