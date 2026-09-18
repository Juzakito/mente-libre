import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function Security() {
  const { showToast } = useOutletContext() || {};
  const [privacySettings, setPrivacySettings] = useState({
    hideCareer: false,
    allowDM: true,
    hideProfile: false
  });

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '12px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={22} color="var(--primary)" strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Privacidad y Seguridad</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.1rem 0 0', fontWeight: 500 }}>Gestiona quién puede ver tu actividad</p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--surface-elevated)', 
          border: '1px solid var(--primary-light)', 
          padding: '1rem', 
          borderRadius: '16px', 
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem' 
        }}>
          <Lock size={18} color="var(--primary)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.2rem' }}>100% Anónimo</div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.8rem', lineHeight: 1.5, opacity: 0.8 }}>
              Tu nombre e identidad real nunca se vinculan con tus publicaciones. Tu privacidad está garantizada.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          {[
            { key: 'hideCareer', label: 'Ocultar mi carrera', desc: 'No mostrar mi facultad en posts' },
            { key: 'allowDM', label: 'Permitir chats privados', desc: 'Recibir mensajes directos de Aliados' },
            { key: 'hideProfile', label: 'Modo Incógnito', desc: 'Ocultar mi perfil del directorio de estudiantes' }
          ].map((setting) => (
            <label
              key={setting.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{setting.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{setting.desc}</div>
              </div>
              
              {/* Custom Toggle Switch */}
              <div style={{
                width: '40px',
                height: '22px',
                backgroundColor: privacySettings[setting.key] ? 'var(--primary)' : 'var(--surface-hover)',
                borderRadius: '11px',
                position: 'relative',
                transition: 'background-color 0.3s ease',
                border: privacySettings[setting.key] ? 'none' : '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: privacySettings[setting.key] ? '2px' : '1px',
                  left: privacySettings[setting.key] ? '20px' : '2px',
                  transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
              
              <input
                type="checkbox"
                checked={privacySettings[setting.key]}
                onChange={(e) => {
                  setPrivacySettings(prev => ({ ...prev, [setting.key]: e.target.checked }));
                  if (showToast) showToast('Preferencias actualizadas');
                }}
                style={{ display: 'none' }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
