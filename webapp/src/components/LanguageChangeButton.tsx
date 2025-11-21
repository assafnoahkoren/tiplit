import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface LanguageChangeButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function LanguageChangeButton({
  variant = 'outline',
  size = 'sm',
  className
}: LanguageChangeButtonProps) {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={className}
    >
      {i18n.language === 'en' ? '🇮🇱 עב' : '🇺🇸 EN'}
    </Button>
  )
}
