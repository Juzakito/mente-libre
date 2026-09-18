import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import TalkCampusLogo from '../components/ui/TalkCampusLogo';
import ShareModal from '../components/ShareModal';

export default function About() {
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
        <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <TalkCampusLogo size={32} showText={false} />
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Free Mind</span>
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, textAlign: 'center', fontWeight: 500 }}>
            La plataforma universitaria diseñada para brindar apoyo psicológico anónimo y contención emocional entre pares.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>+5.2k</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estudiantes</div>
            </div>
            <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>+18k</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abrazos</div>
            </div>
            <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>100%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Anónimo</div>
            </div>
          </div>

          <button
            onClick={() => setShowShare(true)}
            style={{ 
              width: '100%', 
              backgroundColor: 'var(--text-main)', 
              color: 'var(--surface)', 
              border: 'none', 
              padding: '0.9rem', 
              borderRadius: '14px', 
              fontWeight: 800, 
              fontSize: '0.95rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Compartir Plataforma
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
  );
}
