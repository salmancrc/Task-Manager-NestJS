require('dotenv/config');

const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Set SEED_USER_EMAIL and SEED_USER_PASSWORD before running the seed.',
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('SEED_USER_EMAIL must be a valid email address.');
  }
  if (password.length < 6) {
    throw new Error('SEED_USER_PASSWORD must be at least 6 characters.');
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL must be set before running the seed.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const user =
      existingUser ??
      (await prisma.user.create({
        data: {
          email,
          name: process.env.SEED_USER_NAME || 'Demo User',
          password: await bcrypt.hash(password, 10),
        },
      }));

    const sampleTasks = [
      { title: 'Review the weekly plan', priority: 'HIGH', completed: false },
      { title: 'Organize project notes', priority: 'MEDIUM', completed: false },
      { title: 'Set up the task manager', priority: 'LOW', completed: true },
    ];

    for (const task of sampleTasks) {
      const existingTask = await prisma.task.findFirst({
        where: { userId: user.id, title: task.title },
      });

      if (!existingTask) {
        await prisma.task.create({
          data: { ...task, userId: user.id },
        });
      }
    }

    console.info(`Seed data ensured for ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Database seed failed:', error);
  process.exitCode = 1;
});
