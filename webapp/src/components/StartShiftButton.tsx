import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, MapPin } from 'lucide-react'
import { trpc } from '@/lib/trpc'

const DEFAULT_SHIFT_HOURS = 8

interface StartShiftButtonProps {
  onShiftStarted?: () => void
}

export function StartShiftButton({ onShiftStarted }: StartShiftButtonProps) {
  const { t } = useTranslation()
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Start shift mutation
  const startShiftMutation = trpc.workSession.start.useMutation({
    onSuccess: () => {
      setIsGettingLocation(false)
      onShiftStarted?.()
    },
    onError: (error) => {
      console.error('Failed to start shift:', error)
      setLocationError(t('shift_errorStartFailed'))
      setIsGettingLocation(false)
    },
  })

  const handleStartShift = () => {
    setIsGettingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError(t('shift_errorNotSupported'))
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const endTime = new Date()
        endTime.setHours(endTime.getHours() + DEFAULT_SHIFT_HOURS)

        startShiftMutation.mutate({
          latitude,
          longitude,
          endTime,
        })
      },
      (error) => {
        console.error('Location error:', error)
        setLocationError(t('shift_errorLocation'))
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const isLoading = isGettingLocation || startShiftMutation.isPending

  return (
    <>
      <button
        onClick={handleStartShift}
        disabled={isLoading}
        className="relative w-64 h-64 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="text-sm">{t('shift_gettingLocation')}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
              <MapPin className="h-12 w-12" />
            <span className="text-2xl font-bold">{t('shift_startButton')}</span>
          </div>
        )}
      </button>

      {locationError && (
        <div className="text-destructive text-sm text-center max-w-xs">
          {locationError}
        </div>
      )}

      <p className="text-muted-foreground text-sm text-center">
        {t('shift_tapToStart')}
      </p>
    </>
  )
}
