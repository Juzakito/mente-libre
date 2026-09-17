import React from 'react';

export default function FreeMindLogo({ size = 32, showText = true, textColor = '#ffffff', style = {}, subtitle = null }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', ...style }}>
      {/* Free Mind Logo Icon */}
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 2px 8px rgba(0, 230, 118, 0.25))',
        flexShrink: 0
      }}>
        <img
          src="/logo.png"
          alt="Free Mind Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <span style={{
            fontWeight: 900,
            fontSize: `${size * 0.65}px`,
            letterSpacing: '-0.03em',
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Free Mind
          </span>
          {subtitle && (
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#00e676',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00e676', display: 'inline-block', boxShadow: '0 0 6px #00e676' }} />
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
