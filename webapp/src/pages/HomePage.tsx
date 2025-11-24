import { trpc } from '@/lib/trpc'
import { ActiveShiftDisplay } from '@/components/ActiveShiftDisplay'
import { StartShiftButton } from '@/components/StartShiftButton'

export function HomePage() {
  // Get current active session
  const activeSessionQuery = trpc.workSession.getMyActive.useQuery(undefined, {
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const handleShiftStarted = () => {
    activeSessionQuery.refetch()
  }

  const activeSession = activeSessionQuery.data
  const hasActiveShift = activeSession && new Date(activeSession.endTime) > new Date()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        {!hasActiveShift ? (
          <StartShiftButton onShiftStarted={handleShiftStarted} />
        ) : (
          <ActiveShiftDisplay />
        )}
      </div>
    </div>
  )
}
