import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageChangeButton } from './LanguageChangeButton'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-end gap-2">
          <ThemeToggle />
          <LanguageChangeButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
