import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { trpc } from '@/lib/trpc'
import { clearSession, getSessionId } from '@/lib/auth'

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sessionId = getSessionId()

  // Example tRPC queries
  const healthQuery = trpc.health.useQuery()
  const greetingQuery = trpc.greeting.useQuery({ name: 'World' })

  // Get current user data - sessionId is automatically sent in headers!
  const userQuery = trpc.auth.me.useQuery()

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearSession()
      navigate('/login')
    },
    onError: (error) => {
      console.error('Logout error:', error)
      // Clear session anyway on error
      clearSession()
      navigate('/login')
    },
  })

  const handleLogout = () => {
    if (sessionId) {
      logoutMutation.mutate({ sessionId })
    } else {
      clearSession()
      navigate('/login')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('app_title')}</CardTitle>
          <CardDescription>{t('app_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Welcome to the home page!</p>

          {/* tRPC Demo Section */}
          <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
            <h3 className="font-semibold">tRPC Connection Demo:</h3>

            {/* Health Check */}
            <div className="text-sm">
              <span className="font-medium">Server Health: </span>
              {healthQuery.isLoading && <span className="text-muted-foreground">Loading...</span>}
              {healthQuery.error && <span className="text-destructive">Error connecting to server</span>}
              {healthQuery.data && (
                <span className="text-accent">
                  {healthQuery.data.status} - {new Date(healthQuery.data.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Greeting */}
            <div className="text-sm">
              <span className="font-medium">Greeting: </span>
              {greetingQuery.isLoading && <span className="text-muted-foreground">Loading...</span>}
              {greetingQuery.error && <span className="text-destructive">Error</span>}
              {greetingQuery.data && <span>{greetingQuery.data.message}</span>}
            </div>
          </div>

          {/* User Info */}
          {userQuery.data && (
            <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
              <h3 className="font-semibold">Current User:</h3>
              <div className="text-sm space-y-1">
                {userQuery.data.name && (
                  <div>
                    <span className="font-medium">Name: </span>
                    <span>{userQuery.data.name}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Email: </span>
                  <span>{userQuery.data.email}</span>
                </div>
                <div>
                  <span className="font-medium">User ID: </span>
                  <span className="font-mono text-xs">{userQuery.data.id}</span>
                </div>
                <div>
                  <span className="font-medium">Member Since: </span>
                  <span>{new Date(userQuery.data.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          {userQuery.isLoading && (
            <div className="text-sm text-muted-foreground">Loading user data...</div>
          )}
          {userQuery.error && (
            <div className="text-sm text-destructive">Failed to load user data</div>
          )}

          <div className="flex gap-4">
            <Button asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
