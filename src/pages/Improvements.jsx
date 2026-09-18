import React, { useState } from 'react';
import { Lightbulb, Plus, ShieldCheck, ChevronUp } from 'lucide-react';
import AppleEmoji from '../components/ui/AppleEmoji';
import { useOutletContext } from 'react-router-dom';

export default function Improvements() {
  const { showToast } = useOutletContext() || {};
  const [featureVotes, setFeatureVotes] = useState({
    oled: 142,
    audio: 98,
    workshops: 215,
    userVoted: {}
  });
  const [newProposalText, setNewProposalText] = useState('');
  const [customProposals, setCustomProposals] = useState([]);

  const handleUpvoteFeature = (featureKey) => {
    if (featureVotes.userVoted[featureKey]) return;
    setFeatureVotes(prev => ({
      ...prev,
      [featureKey]: prev[featureKey] + 1,
      userVoted: { ...prev.userVoted, [featureKey]: true }
    }));
    if (showToast) showToast('¡Gracias por tu voto! 🚀');
  };

  const handleAddProposal = (e) => {
    e?.preventDefault();
    if (!newProposalText.trim()) return;
    const newProp = {
      id: Date.now(),
      title: newProposalText.trim(),
      votes: 1
    };
    setCustomProposals([newProp, ...customProposals]);
    setNewProposalText('');
    if (showToast) showToast('¡Tu sugerencia ha sido enviada para votación! 💡');
  };

  const totalVotes = (featureVotes.oled || 0) + (featureVotes.audio || 0) + (featureVotes.workshops || 0) || 1;
  const featureList = [
    {
      key: 'oled',
      rank: '#1',
      icon: '🌙',
      iconBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)',
      iconBorder: 'rgba(99, 102, 241, 0.3)',
      tagBg: 'rgba(99, 102, 241, 0.1)',
      tagColor: '#818cf8',
      title: 'Modo Nocturno Profundo OLED',
      tag: 'Diseño & UI',
      desc: 'Fondo negro 100% puro para máxima relajación ocular durante desvelos de estudio y lectura.',
      votes: featureVotes.oled
    },
    {
      key: 'audio',
      rank: '#2',
      icon: '🎙️',
      iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
      iconBorder: 'rgba(16, 185, 129, 0.3)',
      tagBg: 'rgba(16, 185, 129, 0.1)',
      tagColor: 'var(--primary)',
      title: 'Salas de Audio Anónimas 24/7',
      tag: 'Comunidad en Vivo',
      desc: 'Salas de voz en tiempo real con distorsión de voz opcional para acompañarte mientras estudias.',
      votes: featureVotes.audio
    },
    {
      key: 'workshops',
      rank: '#3',
      icon: '🧘',
      iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
      iconBorder: 'rgba(245, 158, 11, 0.3)',
      tagBg: 'rgba(245, 158, 11, 0.1)',
      tagColor: '#fbbf24',
      title: 'Talleres de Manejo de Ansiedad',
      tag: 'Salud Mental',
      desc: 'Módulos prácticos guiados con psicólogos y ejercicios de respiración interactivos ante exámenes.',
      votes: featureVotes.workshops
    }
  ];

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.05))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <AppleEmoji emoji="⚡" size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Roadmap & Próximas Funciones
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--primary)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', animation: 'pulse-soft 1.5s infinite' }} />
                Votación Abierta
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
              Priorizamos el desarrollo según las necesidades reales de los estudiantes. ¡Haz escuchar tu voz!
            </p>
          </div>
        </div>

        {/* Features List with Rich Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {featureList.map((feat) => {
            const hasVoted = !!featureVotes.userVoted[feat.key];
            const percent = Math.round((feat.votes / totalVotes) * 100);

            return (
              <div
                key={feat.key}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '18px',
                  backgroundColor: 'var(--surface-elevated)',
                  border: hasVoted ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: hasVoted ? '0 8px 24px rgba(16, 185, 129, 0.15)' : '0 2px 10px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={(e) => {
                  if (!hasVoted) e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!hasVoted) e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = hasVoted ? '0 8px 24px rgba(16, 185, 129, 0.15)' : '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                {/* Left: Icon & Middle: Details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: feat.iconBg,
                    border: `1px solid ${feat.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                  }}>
                    <AppleEmoji emoji={feat.icon} size={22} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                            {feat.title}
                          </span>
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            padding: '0.12rem 0.4rem',
                            borderRadius: '6px',
                            backgroundColor: feat.tagBg,
                            color: feat.tagColor,
                            letterSpacing: '0.02em'
                          }}>
                            {feat.tag}
                          </span>
                        </div>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {feat.desc}
                        </span>
                      </div>
                      
                      {/* Right: Compact Vote Widget */}
                      <button
                        onClick={() => handleUpvoteFeature(feat.key)}
                        style={{
                          padding: '0.35rem 0.55rem',
                          borderRadius: '10px',
                          backgroundColor: hasVoted ? 'var(--primary)' : 'var(--surface)',
                          color: hasVoted ? '#ffffff' : 'var(--text-main)',
                          border: hasVoted ? '1.5px solid var(--primary)' : '1.5px solid var(--border-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          flexShrink: 0,
                          boxShadow: hasVoted ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!hasVoted) {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!hasVoted) {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-main)';
                          }
                        }}
                      >
                        <ChevronUp size={14} strokeWidth={hasVoted ? 3 : 2.5} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{feat.votes}</span>
                      </button>
                    </div>

                    {/* Progress bar of votes */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.6rem' }}>
                      <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: hasVoted ? 'linear-gradient(90deg, var(--primary), #00e676)' : 'var(--primary)',
                          borderRadius: '9999px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        {percent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Custom User Proposals */}
          {customProposals.map((prop) => (
            <div
              key={prop.id}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '18px',
                backgroundColor: 'rgba(16, 185, 129, 0.04)',
                border: '1.5px dashed rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <AppleEmoji emoji="💡" size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      {prop.title}
                    </span>
                    <span style={{
                      fontSize: '0.62rem',
                      color: 'var(--primary)',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      padding: '0.12rem 0.4rem',
                      borderRadius: '6px',
                      fontWeight: 800
                    }}>
                      En revisión 🚀
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    Propuesta comunitaria enviada por ti • Evaluación para el siguiente sprint
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Form */}
        <div style={{ marginTop: '0.35rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ¿Tienes otra idea para Free Mind?
          </div>
          <form
            onSubmit={handleAddProposal}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-elevated)',
              border: '1.5px solid var(--border-color)',
              borderRadius: '16px',
              padding: '0.4rem 0.5rem 0.4rem 1rem',
              gap: '0.75rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
            }}
          >
            <Lightbulb size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={newProposalText}
              onChange={(e) => setNewProposalText(e.target.value)}
              placeholder="Ej: Modo pomodoro integrado, salas temáticas por carrera..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.5rem 0',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!newProposalText.trim()}
              style={{
                backgroundColor: newProposalText.trim() ? 'var(--primary)' : 'var(--surface)',
                color: newProposalText.trim() ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: newProposalText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
                boxShadow: newProposalText.trim() ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none',
                flexShrink: 0
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Proponer</span>
            </button>
          </form>
        </div>

        {/* Guarantee Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1rem',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.18)'
        }}>
          <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Las propuestas más votadas cada mes son priorizadas e implementadas directamente por el equipo.
          </span>
        </div>
      </div>
    </div>
  );
}
