import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] flex flex-col">{children}</main>
    </div>
  )
}
