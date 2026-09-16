import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

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
    // Handle Vercel new deployment lazy load chunk error
    if (error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed'))) {
      if (!sessionStorage.getItem('mente-libre-reloaded')) {
        sessionStorage.setItem('mente-libre-reloaded', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-danger)', color: 'var(--accent-rose)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid var(--border-danger)' }}>
            <AlertTriangle size={48} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '1rem' }}>
            Ups, nuestro búho tropezó
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '1rem', lineHeight: '1.5' }}>
            Algo salió mal en esta página. No te preocupes, tus datos están a salvo. Intenta recargar la página para solucionar el problema.
          </p>
          <div style={{ maxWidth: '600px', padding: '1rem', backgroundColor: '#1e293b', color: '#f87171', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left', overflowX: 'auto', fontSize: '0.8rem' }}>
            <strong>{this.state.error && this.state.error.toString()}</strong>
            <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error && this.state.error.stack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}
          >
            <RefreshCcw size={18} /> Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
