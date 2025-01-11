import { PrismaClient } from '@prisma/client';
/** Avoid multiple Prisma Client instances
When developing a Next.js application, one common issue is accidentally creating multiple instances of the Prisma Client. This often occurs due to Next.js’s hot-reloading feature in development.
Why this happens
Next.js’s hot-reloading feature reloads modules frequently to reflect code changes instantly. However, this can lead to multiple instances of Prisma Client being created, which consumes resources and might cause unexpected behavior.
Recommended solution
To avoid this, create a single Prisma Client instance by using a global variable:
Using this approach ensures that only one instance of Prisma Client exists, even during hot-reloading in development. */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
