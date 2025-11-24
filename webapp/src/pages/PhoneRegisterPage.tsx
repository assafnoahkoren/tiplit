import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { setSession } from '@/lib/auth'
import { PhoneInputWrapper } from '@/components/PhoneInputWrapper'
import { OTPInput } from '@/components/OTPInput'

export function PhoneRegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
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

  const registerMutation = trpc.auth.registerWithPhone.useMutation({
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
    registerMutation.mutate({ phoneNumber, code, name: name || undefined })
  }

  const handleResendOtp = () => {
    setError('')
    requestOtpMutation.mutate({ phoneNumber })
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex-1 flex flex-col justify-end px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('phoneRegister_title')}</h1>
          <p className="text-muted-foreground">
            {step === 'phone'
              ? t('phoneRegister_descriptionPhone')
              : t('phoneRegister_descriptionOtp')}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="flex flex-col">
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('phoneRegister_name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('phoneRegister_namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
            </div>
            <div className="space-y-4 pt-6">
              <Button
                className="w-full"
                type="submit"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? t('phoneRegister_sending') : t('phoneRegister_requestCode')}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                {t('phoneRegister_hasAccount')}{' '}
                <Link to="/login" className="text-primary hover:underline">
                  {t('phoneRegister_loginLink')}
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col">
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {t('phoneRegister_codeSentTo')} <span className="font-medium text-foreground">{phoneNumber}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-primary hover:underline"
                  >
                    {t('phoneRegister_change')}
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
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>
            <div className="space-y-4 pt-6">
              <Button
                className="w-full"
                type="submit"
                disabled={registerMutation.isPending || code.length !== 4}
              >
                {registerMutation.isPending ? t('phoneRegister_verifying') : t('phoneRegister_createAccount')}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={handleResendOtp}
                disabled={requestOtpMutation.isPending}
                className="w-full"
              >
                {requestOtpMutation.isPending ? t('phoneRegister_sending') : t('phoneRegister_resend')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
