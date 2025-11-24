import { ThemeToggle } from './ThemeToggle'
import { LanguageChangeButton } from './LanguageChangeButton'
import { ThemeImage } from './ThemeImage'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border h-16 bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="w-24"></div>
          <ThemeImage
            lightSrc="/assets/images/logos/tiplit-logo-full-light.png"
            darkSrc="/assets/images/logos/tiplit-logo-full-dark.png"
            alt="Tiplit"
            className="h-8"
          />
          <div className="flex gap-2">
            <ThemeToggle />
            <LanguageChangeButton />
          </div>
        </div>
      </header>
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col">{children}</main>
    </div>
  )
}
