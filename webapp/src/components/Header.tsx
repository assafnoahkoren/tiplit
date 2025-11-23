import { ThemeToggle } from './ThemeToggle'
import { LanguageChangeButton } from './LanguageChangeButton'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border h-16 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-end gap-2">
        <ThemeToggle />
        <LanguageChangeButton />
      </div>
    </header>
  )
}
