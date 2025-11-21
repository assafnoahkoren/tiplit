import { initTRPC } from '@trpc/server'
import type { User } from '@prisma/client'
import type { Request } from 'express'

/**
 * Context type that will be available in all procedures
 */
export type Context = {
  req?: Request
  user?: Omit<User, 'passwordHash'>
  session?: {
    id: string
    userId: string
    expiresAt: Date
  }
}

/**
 * Initialization of tRPC backend with context
 */
const t = initTRPC.context<Context>().create()

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router
export const publicProcedure = t.procedure
