import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppleEmoji from '../components/ui/AppleEmoji';

export default function Dotz() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AppleEmoji emoji="🪶" size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Dotz (Plumas) & Logros
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.15rem 0 0' }}>
              Recompensas por tu empatía, racha y autocuidado
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <span>150</span>
              <AppleEmoji emoji="🪶" size={20} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>Plumas Acumuladas</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <span>3 Días</span>
              <AppleEmoji emoji="🔥" size={20} />
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>Racha de Bienestar</div>
          </div>
        </div>

        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            Misiones para ganar más plumas:
          </div>
          <button
            onClick={() => navigate('/app/mood')}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-color)',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>+10</span>
              <AppleEmoji emoji="🪶" size={16} />
              <span>Registrar tu estado de ánimo de hoy</span>
            </div>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Ir →</span>
          </button>
          <button
            onClick={() => navigate('/app/feed')}
            style={{
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-color)',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>+5</span>
              <AppleEmoji emoji="🪶" size={16} />
              <span>Enviar un abrazo virtual a un compañero</span>
            </div>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Ir →</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/app/profile')}
          style={{
            width: '100%',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            padding: '0.85rem',
            borderRadius: '14px',
            fontWeight: 850,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          Abrir Tienda de Avatares →
        </button>
      </div>
    </div>
  );
}
