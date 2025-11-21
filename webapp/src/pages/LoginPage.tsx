import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t('app_title')}</CardTitle>
          <CardDescription>
            {t('app_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('form_email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('form_emailPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('form_password')}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t('form_passwordPlaceholder')}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button className="flex-1" variant="outline" asChild>
              <Link to="/">{t('form_cancel')}</Link>
            </Button>
            <Button className="flex-1">
              {t('form_submit')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
