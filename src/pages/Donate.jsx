import React from 'react';
import { Coffee, ExternalLink } from 'lucide-react';

export default function Donate() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto', paddingBottom: '6rem' }} className="animate-fade-in">
      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem 1.5rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Background blobs for aesthetic */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'var(--primary)', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '150px', height: '150px', background: 'var(--accent-emerald)', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%' }}></div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
          Apoya a Free Mind <Coffee size={24} color="var(--primary)" />
        </h2>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          Escanea el código QR o haz clic en el enlace para invitarnos un café ☕
        </p>

        {/* QR Code */}
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1, boxShadow: 'var(--shadow-md)' }}>
          <img 
            src="/qr_donacion.png" 
            alt="QR Buy Me a Coffee" 
            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
          />
        </div>

        {/* Direct Link */}
        <a 
          href="https://buymeacoffee.com/josecontact" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            padding: '1rem 1.5rem', 
            borderRadius: 'var(--radius-full)', 
            fontWeight: 800, 
            fontSize: '1rem', 
            textDecoration: 'none',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          buymeacoffee.com/josecontact <ExternalLink size={18} />
        </a>

      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
        Las donaciones nos ayudan a cubrir los costos de los servidores de la IA y el alojamiento web, asegurando que la herramienta siga siendo gratuita para todos los universitarios.
      </p>
    </div>
  );
}
