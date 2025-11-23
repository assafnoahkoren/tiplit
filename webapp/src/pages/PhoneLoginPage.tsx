import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { setSession } from '@/lib/auth'
import { PhoneInputWrapper } from '@/components/PhoneInputWrapper'
import { OTPInput } from '@/components/OTPInput'

export function PhoneLoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const requestOtpMutation = trpc.auth.requestPhoneOtp.useMutation({
    onSuccess: () => {
      setStep('otp')
      setError('')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const loginMutation = trpc.auth.loginWithPhone.useMutation({
    onSuccess: (data) => {
      setSession(data.userId, data.sessionId)
      navigate('/')
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    requestOtpMutation.mutate({ phoneNumber })
  }

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate({ phoneNumber, code })
  }

  const handleResendOtp = () => {
    setError('')
    requestOtpMutation.mutate({ phoneNumber })
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t('phoneLogin_title')}</CardTitle>
          <CardDescription>
            {step === 'phone'
              ? t('phoneLogin_descriptionPhone')
              : t('phoneLogin_descriptionOtp')}
          </CardDescription>
        </CardHeader>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  {t('auth_phone')}
                </label>
                <PhoneInputWrapper
                  id="phone"
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value || '')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('auth_phoneFormat')}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                type="submit"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? t('phoneLogin_sending') : t('phoneLogin_requestCode')}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                {t('phoneLogin_noAccount')}{' '}
                <Link to="/register" className="text-primary hover:underline">
                  {t('phoneLogin_registerPhoneLink')}
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t('phoneLogin_codeSentTo')} <span className="font-medium text-foreground">{phoneNumber}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-primary hover:underline"
                  >
                    {t('phoneLogin_change')}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  {t('auth_otp')}
                </label>
                <OTPInput
                  id="code"
                  value={code}
                  onChange={setCode}
                  disabled={loginMutation.isPending}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                type="submit"
                disabled={loginMutation.isPending || code.length !== 4}
              >
                {loginMutation.isPending ? t('phoneLogin_verifying') : t('phoneLogin_verify')}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={handleResendOtp}
                disabled={requestOtpMutation.isPending}
                className="w-full"
              >
                {requestOtpMutation.isPending ? t('phoneLogin_sending') : t('phoneLogin_resend')}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
