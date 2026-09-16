import React, { useState } from 'react';
import { Moon, Clock, Brain, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ExamAnxietyGuide() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 1,
      title: 'Día Antes',
      icon: <Moon size={18} />,
      tips: [
        'Duerme al menos 7-8 horas. Un cerebro descansado retiene más.',
        'Deja de estudiar 2 horas antes de dormir.',
        'Prepara tu mochila y materiales con anticipación.'
      ]
    },
    {
      id: 2,
      title: 'Minutos Antes',
      icon: <Clock size={18} />,
      tips: [
        'Evita hablar de los temas del examen con compañeros ansiosos.',
        'Respira profundo (Inhala 4s, mantén 4s, exhala 4s).',
        'Visualízate completando el examen con éxito.'
      ]
    },
    {
      id: 3,
      title: 'Durante Examen',
      icon: <Brain size={18} />,
      tips: [
        'Lee todas las instrucciones detenidamente.',
        'Empieza por las preguntas que te parezcan más fáciles.',
        'Si te bloqueas en una, sáltala y vuelve al final.'
      ]
    }
  ];

  const toggleTip = (stepIndex, tipIndex) => {
    const key = `${stepIndex}-${tipIndex}`;
    setCompletedSteps(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const progress = Math.round((completedSteps.length / (steps[0].tips.length + steps[1].tips.length + steps[2].tips.length)) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          <span>{t('explore.prepProgress')}</span>
          <span style={{ color: 'var(--accent-emerald)' }}>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--accent-emerald)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(index)}
            style={{
              flex: '1 0 auto',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: activeStep === index ? 'var(--accent-emerald)' : 'transparent',
              color: activeStep === index ? 'white' : 'var(--text-light)',
              border: 'none',
              transition: 'all 0.2s',
            }}
          >
            {step.icon}
            <span style={{ whiteSpace: 'nowrap' }}>
              {step.title}
            </span>
          </button>
        ))}
      </div>

      {/* Active Step Content */}
      <div className="animate-fade-in" key={activeStep}>
        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent-emerald)' }}>{steps[activeStep].icon}</span>
          {steps[activeStep].title}
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps[activeStep].tips.map((tip, idx) => {
            const isCompleted = completedSteps.includes(`${activeStep}-${idx}`);
            return (
              <div 
                key={idx} 
                onClick={() => toggleTip(activeStep, idx)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem', 
                  backgroundColor: isCompleted ? 'var(--primary-light)' : 'var(--surface)', 
                  border: `1px solid ${isCompleted ? 'var(--accent-emerald)' : 'var(--border-color)'}`,
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s',
                  boxShadow: isCompleted ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                }}
              >
                <div style={{ 
                  width: '20px', height: '20px', 
                  borderRadius: '50%', 
                  border: `2px solid ${isCompleted ? 'var(--accent-emerald)' : 'var(--text-light)'}`,
                  backgroundColor: isCompleted ? 'var(--accent-emerald)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  marginTop: '0.1rem'
                }}>
                  {isCompleted && <Check size={12} fill="white" color="white" />}
                </div>
                <span style={{ fontSize: '0.85rem', color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: isCompleted ? 'line-through' : 'none', transition: 'all 0.2s', lineHeight: 1.4 }}>
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
