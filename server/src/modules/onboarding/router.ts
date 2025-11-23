import { router } from '../../trpc.js'
import { protectedProcedure } from '../../middleware/auth.js'
import { prisma } from '../../lib/prisma.js'
import { getNeededSlides } from './slides.js'

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
})
