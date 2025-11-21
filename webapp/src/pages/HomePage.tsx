import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('app_title')}</CardTitle>
          <CardDescription>{t('app_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Welcome to the home page!</p>
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
