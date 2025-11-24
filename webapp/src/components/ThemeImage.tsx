import { forwardRef } from 'react'
import { useTheme } from '@/components/ThemeProvider'

interface ThemeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  lightSrc: string
  darkSrc: string
}

export const ThemeImage = forwardRef<HTMLImageElement, ThemeImageProps>(
  ({ lightSrc, darkSrc, alt, ...props }, ref) => {
    const { actualTheme } = useTheme()

    return (
      <img
        ref={ref}
        src={actualTheme === 'dark' ? darkSrc : lightSrc}
        alt={alt}
        {...props}
      />
    )
  }
)

ThemeImage.displayName = 'ThemeImage'
