import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'

interface PhoneSlideProps {
  onComplete: () => void
}

export interface SlideRef {
  submit: () => void
}

export const PhoneSlide = forwardRef<SlideRef, PhoneSlideProps>(({ onComplete }, ref) => {
  const phoneRef = useRef<HTMLInputElement>(null)
  const otpRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const requestOtpMutation = trpc.onboarding.requestPhoneOtp.useMutation({
    onSuccess: () => {
      setShowOtpInput(true)
      setError('')
      if (phoneRef.current) {
        setPhoneNumber(phoneRef.current.value)
      }
    },
    onError: (error) => setError(error.message),
  })

  const addPhoneMutation = trpc.onboarding.addPhone.useMutation({
    onSuccess: () => {
      setError('')
      setShowOtpInput(false)
      onComplete()
    },
    onError: (error) => setError(error.message),
  })

  useImperativeHandle(ref, () => ({
    submit: () => {
      setError('')
      if (!showOtpInput && phoneRef.current) {
        requestOtpMutation.mutate({ phoneNumber: phoneRef.current.value })
      } else if (showOtpInput && otpRef.current) {
        addPhoneMutation.mutate({ phoneNumber, code: otpRef.current.value })
      }
    }
  }))

  const isLoading = requestOtpMutation.isPending || addPhoneMutation.isPending

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
              ref={phoneRef}
              id="phone"
              type="tel"
              placeholder="+1234567890 (E.164 format)"
              required
              disabled={isLoading}
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
              ref={otpRef}
              id="otp"
              type="text"
              placeholder="Enter 4-digit code"
              required
              maxLength={4}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Check your phone for the verification code
            </p>
          </div>
        )}
      </CardContent>
    </>
  )
})
