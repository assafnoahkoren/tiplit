import { ThemeToggle } from './ThemeToggle'
import { LanguageChangeButton } from './LanguageChangeButton'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border h-16 bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-end gap-2">
          <ThemeToggle />
          <LanguageChangeButton />
        </div>
      </header>
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col">{children}</main>
    </div>
  )
}
