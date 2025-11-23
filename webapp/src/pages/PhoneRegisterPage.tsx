import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { setSession } from '@/lib/auth'

export function PhoneRegisterPage() {
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
    <div className="flex flex-1 items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account with Phone</CardTitle>
          <CardDescription>
            {step === 'phone'
              ? 'Enter your phone number to receive a verification code'
              : 'Enter the 4-digit code sent to your phone'}
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
                <label htmlFor="name" className="text-sm font-medium">
                  Name (Optional)
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                type="submit"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? 'Sending...' : 'Send Verification Code'}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/phone-login" className="text-primary hover:underline">
                  Login with phone
                </Link>
                {' or '}
                <Link to="/login" className="text-primary hover:underline">
                  Login with email
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
                  Code sent to: <span className="font-medium text-foreground">{phoneNumber}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-primary hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  required
                  maxLength={4}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                type="submit"
                disabled={registerMutation.isPending || code.length !== 4}
              >
                {registerMutation.isPending ? 'Verifying...' : 'Create Account'}
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={handleResendOtp}
                disabled={requestOtpMutation.isPending}
                className="w-full"
              >
                {requestOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
