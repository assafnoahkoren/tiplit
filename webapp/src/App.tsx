import './App.css'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Tiplit</CardTitle>
          <CardDescription>
            shadcn/ui components with RTL support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1" variant="outline">
            Cancel
          </Button>
          <Button className="flex-1">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
