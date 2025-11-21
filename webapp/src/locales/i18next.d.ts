import 'i18next'
import type { TranslationKeys } from './en/translation'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: Record<TranslationKeys, string>
    }
  }
}
