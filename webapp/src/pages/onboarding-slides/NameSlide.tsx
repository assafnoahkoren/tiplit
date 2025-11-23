import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'

interface NameSlideProps {
  onComplete: () => void
}

export interface SlideRef {
  submit: () => void
}

export const NameSlide = forwardRef<SlideRef, NameSlideProps>(({ onComplete }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const updateNameMutation = trpc.onboarding.updateName.useMutation({
    onSuccess: () => {
      setError('')
      onComplete()
    },
    onError: (error) => setError(error.message),
  })

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (inputRef.current) {
        setError('')
        updateNameMutation.mutate({ name: inputRef.current.value })
      }
    }
  }))

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
            ref={inputRef}
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            disabled={updateNameMutation.isPending}
          />
        </div>
      </CardContent>
    </>
  )
})
