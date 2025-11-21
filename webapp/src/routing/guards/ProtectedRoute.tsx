import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { checkAuth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function   ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true

    checkAuth().then((authenticated) => {
      if (mounted) {
        setIsAuthenticated(authenticated)
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render protected content if authenticated
  return <>{children}</>
}
