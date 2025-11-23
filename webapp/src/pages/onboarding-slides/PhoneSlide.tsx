import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <CardTitle className="text-2xl">{t('onboarding_phone_title')}</CardTitle>
        <CardDescription>{t('onboarding_phone_description')}</CardDescription>
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
              {t('onboarding_phone_label')}
            </label>
            <Input
              ref={phoneRef}
              id="phone"
              type="tel"
              placeholder={t('auth_phonePlaceholder')}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {t('auth_phoneFormat')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              {t('onboarding_phone_otpLabel')}
            </label>
            <Input
              ref={otpRef}
              id="otp"
              type="text"
              placeholder={t('onboarding_phone_otpPlaceholder')}
              required
              maxLength={4}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {t('onboarding_phone_otpInfo')}
            </p>
          </div>
        )}
      </CardContent>
    </>
  )
})
