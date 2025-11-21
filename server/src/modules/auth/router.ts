import { z } from 'zod'
import { router, publicProcedure } from '../../trpc.js'
import { registerWithEmail, loginWithEmail, logout } from './service.js'

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { user, session } = await registerWithEmail(
        input.email,
        input.password,
        input.name
      )
      return {
        userId: user.id,
        sessionId: session.id,
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      const { user, session } = await loginWithEmail(input.email, input.password)
      return {
        userId: user.id,
        sessionId: session.id,
      }
    }),

  logout: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      await logout(input.sessionId)
      return { success: true }
    }),
})
