import React, { useState } from 'react';
import { MessageCircle, Heart, Award, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Guide() {
  const navigate = useNavigate();
  const [guideStep, setGuideStep] = useState(1);

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Comienza en Free Mind</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0', fontWeight: 500 }}>Guía rápida ({guideStep}/4)</p>
          </div>
          {/* Progress indicator dots */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            {[1,2,3,4].map(step => (
              <div key={step} style={{ 
                width: step === guideStep ? '16px' : '6px', 
                height: '6px', 
                borderRadius: '3px', 
                backgroundColor: step === guideStep ? 'var(--primary)' : 'var(--border-color)',
                transition: 'all 0.3s ease'
              }} />
            ))}
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)', 
          textAlign: 'left', 
          minHeight: '140px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          {guideStep === 1 && (
            <div className="animate-slide-in-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.65rem' }}>
                <MessageCircle size={20} strokeWidth={2.5} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Desahógate sin juicios</h4>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
                Publica lo que sientes con total tranquilidad. Tu identidad es <strong style={{ color: 'var(--primary)' }}>100% anónima</strong> para que hables sobre estrés o exámenes libremente.
              </p>
            </div>
          )}
          {guideStep === 2 && (
            <div className="animate-slide-in-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.65rem' }}>
                <Heart size={20} strokeWidth={2.5} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Apoya a tus compañeros</h4>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
                Envía <strong>abrazos virtuales</strong> a quienes lo necesiten. Una simple acción empática puede cambiar el día de un estudiante.
              </p>
            </div>
          )}
          {guideStep === 3 && (
            <div className="animate-slide-in-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', marginBottom: '0.65rem' }}>
                <Award size={20} strokeWidth={2.5} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Gana recompensas</h4>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
                Cada día que ayudes a un par, ganarás <strong>Puntos Dotz</strong> para personalizar tu perfil con avatares exclusivos.
              </p>
            </div>
          )}
          {guideStep === 4 && (
            <div className="animate-slide-in-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', marginBottom: '0.65rem' }}>
                <Shield size={20} strokeWidth={2.5} />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Botón S.O.S de Emergencia</h4>
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
                Si necesitas apoyo profesional inmediato, el botón S.O.S te conecta 24/7 con líneas clínicas gratuitas. Nunca estás solo.
              </p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {guideStep > 1 && (
            <button
              onClick={() => setGuideStep(guideStep - 1)}
              style={{ 
                flex: 1, backgroundColor: 'transparent', color: 'var(--text-main)', 
                border: '1px solid var(--border-color)', padding: '0.8rem', 
                borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease', fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Atrás
            </button>
          )}
          <button
            onClick={() => {
              if (guideStep < 4) {
                setGuideStep(guideStep + 1);
              } else {
                navigate('/app/feed');
              }
            }}
            style={{ 
              flex: guideStep === 1 ? '1' : '2', 
              backgroundColor: 'var(--text-main)', color: 'var(--surface)', 
              border: 'none', padding: '0.8rem', 
              borderRadius: '12px', fontWeight: 800, cursor: 'pointer',
              transition: 'all 0.2s ease', fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {guideStep < 4 ? 'Siguiente' : 'Comenzar a explorar'}
          </button>
        </div>
      </div>
    </div>
  );
}
