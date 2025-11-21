import { z } from 'zod'
import { router, publicProcedure } from './trpc.js'

/**
 * Main tRPC router
 * Add your API routes here
 */
export const appRouter = router({
  // Health check endpoint
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  }),

  // Example greeting endpoint with input validation
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name}!` }
    }),

  // Example mutation endpoint
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      // In a real app, you would save to a database here
      return {
        id: Math.random().toString(36).substring(7),
        ...input,
        createdAt: new Date().toISOString(),
      }
    }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
