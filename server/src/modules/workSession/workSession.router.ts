import { z } from 'zod'
import { router } from '../../trpc.js'
import { protectedProcedure } from '../../middleware/auth.js'
import { workSessionService } from './workSession.service.js'

export const workSessionRouter = router({
  /**
   * Start a new work session
   */
  start: protectedProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        endTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return workSessionService.startWorkSession({
        userId: ctx.user.id,
        latitude: input.latitude,
        longitude: input.longitude,
        endTime: input.endTime,
      })
    }),

  /**
   * End current active work session
   */
  end: protectedProcedure.mutation(async ({ ctx }) => {
    await workSessionService.endWorkSession(ctx.user.id)
    return { success: true }
  }),

  /**
   * Get my current active session
   */
  getMyActive: protectedProcedure.query(async ({ ctx }) => {
    return workSessionService.getMyActiveSession(ctx.user.id)
  }),

  /**
   * Get my work session history
   */
  getMyHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return workSessionService.getMyWorkHistory(ctx.user.id, input?.limit)
    }),

  /**
   * Find active workers nearby
   */
  getNearby: protectedProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        radiusMeters: z.number().min(1).max(50000).default(300), // Default 300m, max 50km
      })
    )
    .query(async ({ input }) => {
      return workSessionService.getActiveWorkersNearby({
        latitude: input.latitude,
        longitude: input.longitude,
        radiusMeters: input.radiusMeters,
      })
    }),
})
