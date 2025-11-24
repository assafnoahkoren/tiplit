import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, MapPin, Clock } from 'lucide-react'
import { trpc } from '@/lib/trpc'

export function ActiveShiftDisplay() {
  const { t } = useTranslation()
  // Get current active session
  const activeSessionQuery = trpc.workSession.getMyActive.useQuery(undefined, {
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // End shift mutation
  const endShiftMutation = trpc.workSession.end.useMutation({
    onSuccess: () => {
      activeSessionQuery.refetch()
    },
    onError: (error) => {
      console.error('Failed to end shift:', error)
    },
  })

  const handleEndShift = () => {
    endShiftMutation.mutate()
  }

  const activeSession = activeSessionQuery.data
  const hasActiveShift = activeSession && new Date(activeSession.endTime) > new Date()

  // If no active shift, don't render anything
  if (!hasActiveShift) return null

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date()
    const end = new Date(activeSession.endTime)
    const diffMs = end.getTime() - now.getTime()

    if (diffMs <= 0) return null

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return { hours: diffHours, minutes: diffMinutes }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-4">
          <Clock className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">{t('shift_active')}</h2>
        <p className="text-muted-foreground">{t('shift_visibleToCustomers')}</p>
      </div>

      {timeRemaining && (
        <div className="bg-muted rounded-lg p-6 text-center space-y-1">
          <p className="text-sm text-muted-foreground">{t('shift_timeRemaining')}</p>
          <p className="text-4xl font-bold">
            {timeRemaining.hours}h {timeRemaining.minutes}m
          </p>
        </div>
      )}

      <div className="bg-muted rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('shift_location')}</span>
        </div>
        <p className="text-sm">
          {activeSession.latitude.toFixed(6)}, {activeSession.longitude.toFixed(6)}
        </p>
      </div>

      <Button
        onClick={handleEndShift}
        disabled={endShiftMutation.isPending}
        variant="destructive"
        size="lg"
        className="w-full"
      >
        {endShiftMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('shift_ending')}
          </>
        ) : (
          t('shift_endButton')
        )}
      </Button>
    </div>
  )
}
