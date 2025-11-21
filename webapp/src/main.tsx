import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { I18nLayer } from './components/I18nLayer'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nLayer>
      <App />
    </I18nLayer>
  </StrictMode>,
)
