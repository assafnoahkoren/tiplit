import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is the about page.</p>
          <p>
            Built with React, TypeScript, Tailwind CSS, shadcn/ui, i18next, and React Router.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
