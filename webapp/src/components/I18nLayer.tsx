import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/locales/i18n'

interface I18nLayerProps {
  children: ReactNode
}

export function I18nLayer({ children }: I18nLayerProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    i18n.on('initialized', () => {
      setIsReady(true);
    })

    // If already initialized
    if (i18n.isInitialized) {
      setIsReady(true)
    }
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
