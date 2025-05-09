import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new Prisma Client if it doesn't exist already
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Optional: You can remove log in production
  });

// In development, store the client in the global object
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
