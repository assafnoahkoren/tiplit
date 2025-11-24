import { z } from 'zod'
import { router, publicProcedure } from '../../trpc.js'
import { protectedProcedure } from '../../middleware/auth.js'
import { prisma } from '../../lib/prisma.js'
import {
  registerWithEmail,
  loginWithEmail,
  logout,
  requestPhoneOtp,
  registerWithPhone,
  loginWithPhone,
} from './service.js'
import { OTP_LENGTH } from './otpService.js'

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

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await logout(ctx.session!.id)
    return { success: true }
  }),

  me: protectedProcedure.query(({ ctx }) => {
    // User is automatically validated and available in context!
    return {
      id: ctx.user!.id,
      email: ctx.user!.email,
      phone: ctx.user!.phone,
      name: ctx.user!.name,
      createdAt: ctx.user!.createdAt,
      updatedAt: ctx.user!.updatedAt,
    }
  }),

  avatar: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user!.id },
      select: { avatar: true },
    })
    return { avatar: user?.avatar || null }
  }),

  // Phone authentication endpoints
  requestPhoneOtp: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +1234567890)'),
      })
    )
    .mutation(async ({ input }) => {
      return await requestPhoneOtp(input.phoneNumber)
    }),

  registerWithPhone: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format'),
        code: z.string().length(OTP_LENGTH, `OTP code must be ${OTP_LENGTH} digits`),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { user, session } = await registerWithPhone(
        input.phoneNumber,
        input.code,
        input.name
      )
      return {
        userId: user.id,
        sessionId: session.id,
      }
    }),

  loginWithPhone: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format'),
        code: z.string().length(OTP_LENGTH, `OTP code must be ${OTP_LENGTH} digits`),
      })
    )
    .mutation(async ({ input }) => {
      const { user, session } = await loginWithPhone(input.phoneNumber, input.code)
      return {
        userId: user.id,
        sessionId: session.id,
      }
    }),
})
