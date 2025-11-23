import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { User } from 'lucide-react'

interface AvatarSlideProps {
  onComplete: () => void
}

export interface SlideRef {
  submit: () => void
}

export const AvatarSlide = forwardRef<SlideRef, AvatarSlideProps>(({ onComplete }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Image, setBase64Image] = useState<string>('')

  const updateAvatarMutation = trpc.onboarding.updateAvatar.useMutation({
    onSuccess: () => {
      setError('')
      onComplete()
    },
    onError: (error) => setError(error.message),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setError('')

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setBase64Image(base64String)
    }
    reader.onerror = () => {
      setError('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  useImperativeHandle(ref, () => ({
    submit: () => {
      if (!base64Image) {
        setError('Please select an image')
        return
      }
      setError('')
      updateAvatarMutation.mutate({ avatar: base64Image })
    }
  }))

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Add a profile picture</CardTitle>
        <CardDescription>Upload an image to personalize your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-4">
          {/* Avatar Preview - Clickable */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatar-upload"
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border bg-muted cursor-pointer hover:opacity-80 transition-opacity"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </label>
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Click the avatar to upload an image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={updateAvatarMutation.isPending}
          />
        </div>
      </CardContent>
    </>
  )
})
