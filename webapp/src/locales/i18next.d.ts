import 'i18next'
import type { TranslationKey } from './en/translation'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: Record<TranslationKey, string>
    }
  }
}
