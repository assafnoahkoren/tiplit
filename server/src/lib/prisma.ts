import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

/**
 * Global Prisma client instance
 *
 * This prevents multiple instances of Prisma Client in development
 * due to hot reloading.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
}

// Create PostgreSQL connection pool
const pool = globalForPrisma.pool ?? new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

// Create Prisma adapter
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}

/**
 * Disconnect Prisma on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
