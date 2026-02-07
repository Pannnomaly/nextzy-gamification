import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rewards = [
    { name: 'A', checkpoint: 5000 },
    { name: 'B', checkpoint: 7500 },
    { name: 'C', checkpoint: 10000 },
  ];

  for (const reward of rewards) {
    await prisma.reward.upsert({
      where: { checkpoint: reward.checkpoint },
      update: {},
      create: reward,
    });
  }

  console.log('Rewards seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
