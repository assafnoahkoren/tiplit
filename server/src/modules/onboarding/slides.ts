import type { User } from '@prisma/client'

export interface OnboardingSlide {
  id: string
  isNeeded: (user: User) => boolean
}

/**
 * Define all available onboarding slides
 */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'name',
    isNeeded: (user) => !user.name || user.name.trim() === '',
  },
  {
    id: 'avatar',
    isNeeded: (user) => !user.avatar,
  },
  {
    id: 'phone',
    isNeeded: (user) => !user.phone,
  },
]

/**
 * Get the slides that are needed for a user
 */
export function getNeededSlides(user: User): OnboardingSlide[] {
  return ONBOARDING_SLIDES.filter((slide) => slide.isNeeded(user))
}
