import { TRPCError } from '@trpc/server'
import { publicProcedure } from '../trpc.js'
import { lucia } from '../modules/auth/lucia.js'

/**
 * Middleware to validate session from Authorization header
 * Adds user and session to context if valid
 */
const authMiddleware = publicProcedure.use(async ({ ctx, next }) => {
  // Extract sessionId from Authorization header
  const authHeader = ctx.req?.headers.authorization
  const sessionId = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null

  if (!sessionId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No session provided',
    })
  }

  try {
    // Validate session using Lucia
    const { session, user } = await lucia.validateSession(sessionId)

    if (!session || !user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired session',
      })
    }

    // Add user and session to context
    return next({
      ctx: {
        ...ctx,
        user,
        session,
      },
    })
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error
    }
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Failed to validate session',
    })
  }
})

/**
 * Protected procedure that requires authentication
 * Automatically validates session and adds user to context
 *
 * Usage:
 * ```ts
 * protectedProcedure
 *   .query(({ ctx }) => {
 *     // ctx.user is available and typed
 *     return ctx.user
 *   })
 * ```
 */
export const protectedProcedure = authMiddleware
