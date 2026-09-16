import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SOSModal({ reason, onClose }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--accent-rose)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }} className="animate-fade-in">
      <button 
        onClick={onClose} 
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'white', fontWeight: 800, backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
      >
        Cerrar
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '2.5rem' }}>
        <div style={{ width: '6rem', height: '6rem', backgroundColor: 'var(--surface)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'var(--shadow-xl)' }}>
          <ShieldAlert size={48} color="var(--accent-rose)" />
        </div>
        
        {reason === 'ai-triggered' ? (
          <>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Protocolo I-CARE Activado
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem', lineHeight: 1.1 }}>Nuestra IA ha detectado riesgo</h2>
            <p style={{ color: '#ffe4e6', fontSize: '1rem', marginBottom: '2rem', maxWidth: '300px', fontWeight: 500 }}>
              Por tu seguridad y la normativa vigente (Duty to Warn), no podemos enviar ese mensaje. Hablar con un profesional ahora es vital y gratuito.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>¿Necesitas ayuda inmediata?</h2>
            <p style={{ color: '#ffe4e6', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '300px', fontWeight: 500 }}>
              Estamos aquí para ti. Hablar con un profesional ahora mismo es gratuito y confidencial.
            </p>
          </>
        )}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="tel:113" style={{ display: 'block', width: '100%', backgroundColor: 'white', color: '#be123c', padding: '1.25rem', borderRadius: '1.5rem', textAlign: 'left', textDecoration: 'none', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Llamar al 113</div>
            <div style={{ fontSize: '0.875rem', color: '#f43f5e', fontWeight: 800 }}>Ministerio de Salud - Línea gratuita 24/7</div>
          </a>
          <button 
            onClick={() => window.open('https://wa.me/51952842623?text=Hola,%20necesito%20ayuda%20psicológica%20de%20emergencia.', '_blank')}
            style={{ display: 'block', width: '100%', backgroundColor: 'rgba(159, 18, 57, 0.8)', border: '2px solid rgba(244, 63, 94, 0.5)', color: 'white', padding: '1.25rem', borderRadius: '1.5rem', textAlign: 'left', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(159, 18, 57, 1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(159, 18, 57, 0.8)'}
          >
            <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Chat de Crisis</div>
            <div style={{ fontSize: '0.875rem', color: '#fecaca', fontWeight: 500 }}>Atención psicológica de emergencia (WhatsApp)</div>
          </button>
        </div>
      </div>
    </div>
  );
}
