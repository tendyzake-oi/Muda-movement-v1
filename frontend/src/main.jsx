import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Font (self-hosted lewat npm, tidak bergantung pada Google Fonts)
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/dm-sans'
import '@fontsource/space-mono/400.css'

// Style global: urutan penting (token → dasar)
import './styles/tokens.css'
import './styles/base.css'

import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
