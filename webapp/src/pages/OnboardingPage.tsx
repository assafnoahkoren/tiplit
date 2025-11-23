import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardFooter } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { NameSlide, type SlideRef } from './onboarding-slides/NameSlide'
import { AvatarSlide } from './onboarding-slides/AvatarSlide'
import { PhoneSlide } from './onboarding-slides/PhoneSlide'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const slideRef = useRef<SlideRef>(null)

  // Fetch needed slides
  const { data: onboarding, isLoading: isLoadingSlides, refetch } = trpc.onboarding.getNeededSlides.useQuery()

  // Loading state
  if (isLoadingSlides) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
      </div>
    )
  }

  // If onboarding is complete, redirect to home
  if (onboarding?.isOnboardingComplete) {
    navigate('/', { replace: true })
    return null
  }

  const slides = onboarding?.slides || []
  const currentSlide = slides[currentSlideIndex]

  if (!currentSlide) {
    // No more slides, redirect to home
    navigate('/', { replace: true })
    return null
  }

  // Handle slide completion
  const handleSlideComplete = async () => {
    await refetch()
    setCurrentSlideIndex((prev) => prev + 1)
  }

  const handleSkip = () => {
    setCurrentSlideIndex((prev) => prev + 1)
  }

  // Render slide based on type
  const renderSlideContent = () => {
    switch (currentSlide.id) {
      case 'name':
        return <NameSlide ref={slideRef} onComplete={handleSlideComplete} />
      case 'avatar':
        return <AvatarSlide ref={slideRef} onComplete={handleSlideComplete} />
      case 'phone':
        return <PhoneSlide ref={slideRef} onComplete={handleSlideComplete} />
      default:
        return null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    slideRef.current?.submit()
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4">
      <Card className="flex-1 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {renderSlideContent()}
          <CardFooter className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={handleSkip}
              >
                Skip
              </Button>
              <Button className="flex-1" type="submit">
                Continue
              </Button>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              Step {currentSlideIndex + 1} of {slides.length}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
