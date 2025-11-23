import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [error, setError] = useState('')

  // Fetch needed slides
  const { data: onboarding, isLoading: isLoadingSlides, refetch } = trpc.onboarding.getNeededSlides.useQuery()

  // Name slide state
  const [name, setName] = useState('')
  const updateNameMutation = trpc.onboarding.updateName.useMutation({
    onSuccess: async () => {
      await refetch()
      setCurrentSlideIndex((prev) => prev + 1)
      setError('')
    },
    onError: (error) => setError(error.message),
  })

  // Avatar slide state
  const [avatar, setAvatar] = useState('')
  const updateAvatarMutation = trpc.onboarding.updateAvatar.useMutation({
    onSuccess: async () => {
      await refetch()
      setCurrentSlideIndex((prev) => prev + 1)
      setError('')
    },
    onError: (error) => setError(error.message),
  })

  // Phone slide state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)

  const requestOtpMutation = trpc.onboarding.requestPhoneOtp.useMutation({
    onSuccess: () => {
      setShowOtpInput(true)
      setError('')
    },
    onError: (error) => setError(error.message),
  })

  const addPhoneMutation = trpc.onboarding.addPhone.useMutation({
    onSuccess: async () => {
      await refetch()
      setCurrentSlideIndex((prev) => prev + 1)
      setShowOtpInput(false)
      setError('')
    },
    onError: (error) => setError(error.message),
  })

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

  // Handle form submission based on slide type
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    switch (currentSlide.id) {
      case 'name':
        updateNameMutation.mutate({ name })
        break
      case 'avatar':
        updateAvatarMutation.mutate({ avatar })
        break
      case 'phone':
        if (!showOtpInput) {
          requestOtpMutation.mutate({ phoneNumber })
        } else {
          addPhoneMutation.mutate({ phoneNumber, code: otpCode })
        }
        break
    }
  }

  const handleSkip = () => {
    setCurrentSlideIndex((prev) => prev + 1)
    setError('')
  }

  // Render slide based on type
  const renderSlideContent = () => {
    switch (currentSlide.id) {
      case 'name':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">What should we call you?</CardTitle>
              <CardDescription>Help us personalize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </>
        )

      case 'avatar':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Add a profile picture</CardTitle>
              <CardDescription>Make your profile stand out (base64 encoded)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium">
                  Avatar (base64)
                </label>
                <Input
                  id="avatar"
                  type="text"
                  placeholder="Paste base64 encoded image"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </>
        )

      case 'phone':
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Add your phone number</CardTitle>
              <CardDescription>Enable phone-based authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              {!showOtpInput ? (
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890 (E.164 format)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use international format (e.g., +1234567890)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    maxLength={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Check your phone for the verification code
                  </p>
                </div>
              )}
            </CardContent>
          </>
        )

      default:
        return null
    }
  }

  const isLoading = updateNameMutation.isPending || updateAvatarMutation.isPending || requestOtpMutation.isPending || addPhoneMutation.isPending

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
                disabled={isLoading}
              >
                Skip
              </Button>
              <Button className="flex-1" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : showOtpInput ? 'Verify' : 'Continue'}
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
