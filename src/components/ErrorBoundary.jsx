import React from 'react';
import { AlertTriangle, RefreshCcw, Sparkles } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Handle Vercel new deployment lazy load chunk 404 error
    const msg = error?.message || error?.toString() || '';
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module');

    if (isChunkError) {
      const lastReload = parseInt(sessionStorage.getItem('last_boundary_reload') || '0', 10);
      const now = Date.now();
      // Auto-reload once within cooldown to silently recover to latest build
      if (now - lastReload > 4000) {
        sessionStorage.setItem('last_boundary_reload', now.toString());
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || this.state.error?.toString() || '';
      const isChunkError =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module');

      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem', textAlign: 'center' }}>
          <div style={{
            backgroundColor: isChunkError ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-danger)',
            color: isChunkError ? 'var(--primary)' : 'var(--accent-rose)',
            padding: '1.5rem',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            border: `1px solid ${isChunkError ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-danger)'}`
          }}>
            {isChunkError ? <Sparkles size={48} /> : <AlertTriangle size={48} />}
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.75rem' }}>
            {isChunkError ? 'Nueva versión disponible' : 'Ups, nuestro búho tropezó'}
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: '1.5', fontSize: '0.92rem' }}>
            {isChunkError
              ? 'Hemos desplegado una actualización en vivo en Free Mind. Haz clic abajo para cargar la versión más reciente.'
              : 'Algo salió mal en esta página. No te preocupes, tus datos están a salvo. Intenta recargar la página para solucionar el problema.'}
          </p>
          {!isChunkError && (
            <div style={{ maxWidth: '600px', padding: '1rem', backgroundColor: 'var(--surface-elevated, #1e293b)', color: '#f87171', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem', textAlign: 'left', overflowX: 'auto', fontSize: '0.8rem' }}>
              <strong>{this.state.error && this.state.error.toString()}</strong>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error && this.state.error.stack}
              </pre>
            </div>
          )}
          <button 
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            className="btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}
          >
            <RefreshCcw size={18} /> {isChunkError ? 'Actualizar a la última versión' : 'Recargar Página'}
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
