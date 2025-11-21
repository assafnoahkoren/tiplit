import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider'
import { I18nLayer } from './components/I18nLayer'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nLayer>
        <App />
      </I18nLayer>
    </ThemeProvider>
  </StrictMode>,
)
