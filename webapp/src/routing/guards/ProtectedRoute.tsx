import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { trpc } from '@/lib/trpc'
import { getSessionId, clearSession } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const sessionId = getSessionId()

  // If no session in localStorage, redirect immediately
  if (!sessionId) {
    return <Navigate to="/login" replace />
  }

  // Verify session with backend using the me query
  const { data: user, isLoading, error } = trpc.auth.me.useQuery()

  // Loading state while verifying authentication with backend
  if (isLoading) {
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

  // Render protected content if authenticated
  return <>{children}</>
}
