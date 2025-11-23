import { z } from 'zod'
import { router } from '../../trpc.js'
import { protectedProcedure } from '../../middleware/auth.js'
import { prisma } from '../../lib/prisma.js'
import { getNeededSlides } from './slides.js'
import { requestPhoneOtp } from '../auth/service.js'
import { verifyOtp } from '../auth/otpService.js'
import { OTP_LENGTH } from '../auth/otpService.js'
import { processAvatar } from '../../lib/imageProcessing.js'

export const onboardingRouter = router({
  /**
   * Get the list of onboarding slides that are needed for the current user
   */
  getNeededSlides: protectedProcedure.query(async ({ ctx }) => {
    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: ctx.user!.id },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Get the slides that are needed based on user data
    const neededSlides = getNeededSlides(user)

    return {
      slides: neededSlides,
      totalSlides: neededSlides.length,
      isOnboardingComplete: neededSlides.length === 0,
    }
  }),

  /**
   * Update user's name
   */
  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await prisma.user.update({
        where: { id: ctx.user!.id },
        data: { name: input.name },
      })
      return { success: true }
    }),

  /**
   * Update user's avatar
   * Processes and optimizes the image before saving
   */
  updateAvatar: protectedProcedure
    .input(z.object({ avatar: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Process and optimize the avatar image
      const optimizedAvatar = await processAvatar(input.avatar)

      await prisma.user.update({
        where: { id: ctx.user!.id },
        data: { avatar: optimizedAvatar },
      })
      return { success: true }
    }),

  /**
   * Request OTP for adding phone number
   */
  requestPhoneOtp: protectedProcedure
    .input(z.object({
      phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format'),
    }))
    .mutation(async ({ input }) => {
      return await requestPhoneOtp(input.phoneNumber)
    }),

  /**
   * Verify OTP and add phone number to user
   */
  addPhone: protectedProcedure
    .input(z.object({
      phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format'),
      code: z.string().length(OTP_LENGTH, `OTP code must be ${OTP_LENGTH} digits`),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify OTP
      const isValid = await verifyOtp(input.phoneNumber, input.code)
      if (!isValid) {
        throw new Error('Invalid or expired OTP code')
      }

      // Check if phone number is already in use by another user
      const existingUser = await prisma.user.findUnique({
        where: { phone: input.phoneNumber },
      })

      if (existingUser && existingUser.id !== ctx.user!.id) {
        throw new Error('Phone number already in use')
      }

      // Update user's phone number
      await prisma.user.update({
        where: { id: ctx.user!.id },
        data: { phone: input.phoneNumber },
      })

      return { success: true }
    }),
})
