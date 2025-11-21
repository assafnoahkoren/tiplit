import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { trpc } from '@/lib/trpc'

export function HomePage() {
  const { t } = useTranslation()

  // Example tRPC queries
  const healthQuery = trpc.health.useQuery()
  const greetingQuery = trpc.greeting.useQuery({ name: 'World' })

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

          <div className="flex gap-4">
            <Button asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
