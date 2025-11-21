import { PrismaClient } from '@prisma/client'

/**
 * Global Prisma client instance
 *
 * This prevents multiple instances of Prisma Client in development
 * due to hot reloading.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Disconnect Prisma on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
