import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './i18n/config'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Automatically handle Vite chunk preload errors across new Vercel deployments
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = parseInt(sessionStorage.getItem('last_preload_reload') || '0', 10);
  const now = Date.now();
  if (now - lastReload > 3000) {
    sessionStorage.setItem('last_preload_reload', now.toString());
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
