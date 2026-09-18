import React, { useState, useEffect } from 'react';
import { Heart, PhoneCall, Building, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Helpline() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingText, setBreathingText] = useState('Listo para empezar');

  useEffect(() => {
    let interval;
    if (breathingActive) {
      setBreathingText('Inhala profundamente...');
      let step = 0;
      interval = setInterval(() => {
        step = (step + 1) % 3;
        if (step === 0) setBreathingText('Inhala profundamente...');
        else if (step === 1) setBreathingText('Mantén el aire...');
        else setBreathingText('Exhala lentamente...');
      }, 4000);
    } else {
      setBreathingText('Listo para empezar');
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '12px', 
            backgroundColor: 'rgba(244,63,94,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Heart size={22} color="var(--accent-rose)" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Atención Clínica 24/7</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.1rem 0 0', fontWeight: 500 }}>Soporte psicológico inmediato</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="tel:113"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--accent-rose)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(244,63,94,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,94,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(244,63,94,0.3)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <PhoneCall size={18} strokeWidth={2.5} />
              <span>MINSA 113 (Opción 5)</span>
            </div>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>Gratis</span>
          </a>

          <a
            href="tel:016106400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Building size={18} color="var(--text-muted)" />
              <span>Bienestar Científica del Sur</span>
            </div>
            <ArrowUpRight size={16} color="var(--text-muted)" />
          </a>
        </div>

        {/* Interactive Breathing Exercise Box */}
        <div style={{ 
          backgroundColor: 'var(--surface)', 
          border: '1px solid var(--border-color)', 
          padding: '1.25rem', 
          borderRadius: '18px', 
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
            <Sparkles size={14} /> Ejercicio de Calma
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-main)', 
            fontWeight: 700, 
            minHeight: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            {breathingText}
          </div>
          <button
            onClick={() => setBreathingActive(!breathingActive)}
            style={{
              backgroundColor: breathingActive ? 'rgba(244,63,94,0.1)' : 'var(--primary-light)',
              color: breathingActive ? 'var(--accent-rose)' : 'var(--primary)',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            {breathingActive ? 'Detener Ejercicio' : 'Iniciar Respiración'}
          </button>
        </div>
      </div>
    </div>
  );
}
