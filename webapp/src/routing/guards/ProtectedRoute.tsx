import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { trpc } from '@/lib/trpc'
import { getSessionId, clearSession } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const sessionId = getSessionId()
  const location = useLocation()

  // If no session in localStorage, redirect immediately
  if (!sessionId) {
    return <Navigate to="/login" replace />
  }

  // Verify session with backend using the me query
  const { data: user, isLoading: isLoadingAuth, error } = trpc.auth.me.useQuery()

  // Check onboarding status (skip if already on onboarding page)
  const isOnOnboardingPage = location.pathname === '/onboarding'
  const { data: onboarding, isLoading: isLoadingOnboarding } = trpc.onboarding.getNeededSlides.useQuery(
    undefined,
    { enabled: !!user && !isOnOnboardingPage } // Only run if user is authenticated and not on onboarding page
  )

  // Loading state while verifying authentication with backend
  if (isLoadingAuth || isLoadingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
          <div className="text-sm text-muted-foreground">Verifying authentication...</div>
        </div>
      </div>
    )
  }

  // If authentication failed (invalid/expired session), clear session and redirect
  if (error || !user) {
    clearSession()
    return <Navigate to="/login" replace />
  }

  // If onboarding is not complete, redirect to onboarding (unless already there)
  if (!isOnOnboardingPage && onboarding && !onboarding.isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  // Render protected content if authenticated and onboarding is complete
  return <>{children}</>
}
