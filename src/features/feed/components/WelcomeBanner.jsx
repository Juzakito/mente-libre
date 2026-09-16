import React from 'react';
import AppleEmoji from '../../../components/ui/AppleEmoji';
import { useTranslation } from 'react-i18next';

export default function WelcomeBanner({ user }) {
  const { t } = useTranslation();

  return (
    <div style={{ 
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, #000) 100%)',
      color: 'white', 
      padding: '1.5rem', 
      borderRadius: '24px', 
      display: 'flex', 
      gap: '1.25rem', 
      alignItems: 'center', 
      boxShadow: '0 12px 32px color-mix(in srgb, var(--primary) 40%, transparent), inset 0 2px 0 rgba(255,255,255,0.2)', 
      marginBottom: '1rem',
      border: '1px solid color-mix(in srgb, var(--primary) 80%, white)'
    }}>
      {/* Glow effect */}
      <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle at top left, rgba(255,255,255,0.3) 0%, transparent 60%)', transform: 'rotate(-45deg)', pointerEvents: 'none' }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.75rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        <AppleEmoji emoji={user?.avatar || '👋'} size={48} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{t('student.feed.welcomeTitle')}</h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.25rem' }}>{t('student.feed.welcomeDesc')}</p>
      </div>
    </div>
  );
}
