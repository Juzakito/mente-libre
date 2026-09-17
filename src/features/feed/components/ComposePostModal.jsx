import React, { useState } from 'react';
import { X, Send, ShieldCheck, Tag, Sparkles, Heart, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import AppleEmoji from '../../../components/ui/AppleEmoji';

const INTENTION_OPTIONS = [
  { id: 'desahogo', label: 'Desahogo libre', emoji: '🌿', color: 'var(--accent-emerald)' },
  { id: 'abrumado', label: 'Expresar emoción', emoji: '💭', color: 'var(--accent-blue)' },
  { id: 'consejo', label: 'Buscar consejo', emoji: '💡', color: 'var(--accent-amber)' },
  { id: 'reflexion', label: 'Reflexión universitaria', emoji: '🎓', color: 'var(--accent-purple)' }
];

const SUGGESTED_TAGS = [
  '#Desahogo',
  '#Exámenes',
  '#Ansiedad',
  '#PrimerAño',
  '#Consejos',
  '#Amistad',
  '#Motivación',
  '#Soledad',
  '#Futuro'
];

export default function ComposePostModal({ onClose, onPublish }) {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const [text, setText] = useState('');
  const [selectedIntention, setSelectedIntention] = useState(INTENTION_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState(['#Desahogo']);

  // Detect sensitive crisis keywords for real-time safety banner
  const isCrisisDetected = React.useMemo(() => {
    const lower = text.toLowerCase();
    return lower.includes('quiero morir') || lower.includes('suicidio') || lower.includes('ya no puedo mas') || lower.includes('no aguanto mas');
  }, [text]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      }
    } else {
      if (selectedTags.length >= 3) {
        // limit to 3 tags max for aesthetics
        const newTags = [...selectedTags.slice(1), tag];
        setSelectedTags(newTags);
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handlePublish = () => {
    if (!text.trim()) return;
    const finalTags = [selectedIntention.label, ...selectedTags];
    onPublish(text.trim(), finalTags, selectedIntention.id);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '640px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          color: 'var(--text-main)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface-hover)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              {user?.avatar || '🦉'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  {user?.nickname || 'Estudiante Anónimo'}
                </span>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.15) 0%, rgba(56,189,248,0.15) 100%)',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  border: '1px solid rgba(13,148,136,0.2)'
                }}>
                  <ShieldCheck size={12} strokeWidth={2.5} /> 100% Anónimo
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {user?.career || 'Comunidad Universitaria'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-hover)',
              border: '1px solid transparent',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'var(--surface-elevated)'; 
              e.currentTarget.style.borderColor = 'var(--border-color)'; 
              e.currentTarget.style.color = 'var(--text-main)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; 
              e.currentTarget.style.borderColor = 'transparent'; 
              e.currentTarget.style.color = 'var(--text-muted)'; 
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--surface)' }}>
          
          {/* Privacy Guarantee Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--surface-hover) 0%, var(--bg-color) 100%)',
            border: '1px dashed var(--border-color)',
            borderRadius: '16px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '6px', borderRadius: '10px' }}>
              <Lock size={18} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              <strong style={{ fontWeight: 800 }}>Espacio Seguro:</strong> Tu correo e identidad personal nunca se vinculan a esta publicación.
            </span>
          </div>

          {/* Emotional Intention Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem', display: 'block' }}>
              ¿Qué buscas con esta publicación?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              {INTENTION_OPTIONS.map((m) => {
                const isSelected = selectedIntention.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedIntention(m)}
                    style={{
                      backgroundColor: isSelected ? 'var(--surface)' : 'var(--surface-hover)',
                      border: `1px solid ${isSelected ? m.color : 'transparent'}`,
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }
                    }}
                  >
                    <AppleEmoji emoji={m.emoji} size={18} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe libremente sobre lo que estás viviendo. Este es un espacio respetuoso, libre de juicios y enfocado en el apoyo mutuo..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '160px',
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem',
                fontSize: '1rem',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.6,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 4px rgba(13,148,136,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
              autoFocus
            />

            {/* Character counter */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1.25rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: text.length > 450 ? 'var(--accent-rose)' : 'var(--text-muted)',
              pointerEvents: 'none',
              backgroundColor: 'var(--bg-color)',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              {text.length} <span style={{ opacity: 0.5 }}>/ 500</span>
            </div>
          </div>

          {/* AI Safety Banner (if sensitive phrase typed) */}
          {isCrisisDetected && (
            <div className="animate-slide-down" style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(225,29,72,0.05) 100%)',
              border: '1.5px solid var(--accent-rose)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <div style={{ backgroundColor: 'rgba(244,63,94,0.2)', padding: '6px', borderRadius: '10px' }}>
                <AlertCircle size={20} color="var(--accent-rose)" strokeWidth={2.5} />
              </div>
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-rose)', display: 'block', marginBottom: '0.3rem' }}>
                  Soporte Inmediato Disponible
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, display: 'block' }}>
                  Detectamos que estás pasando por un momento muy difícil. Recuerda que no estás solo. Tienes acceso al <strong>Botón S.O.S</strong> para ayuda clínica gratuita 24/7 en el panel principal.
                </span>
              </div>
            </div>
          )}

          {/* Suggested Tags Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={14} color="var(--text-muted)" /> Temas Sugeridos (Máx 3)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SUGGESTED_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      backgroundColor: active ? 'var(--primary-light)' : 'var(--bg-color)',
                      border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      color: active ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.82rem',
                      fontWeight: active ? 800 : 600,
                      padding: '0.4rem 0.8rem',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: active ? '0 2px 8px rgba(13,148,136,0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.borderColor = 'var(--text-muted)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-color)',
          position: 'relative',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <Sparkles size={16} color="var(--primary)" /> Moderado por la comunidad
          </span>

          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? 'linear-gradient(135deg, var(--primary) 0%, #0891b2 100%)' : 'var(--surface-hover)',
              color: text.trim() ? '#ffffff' : 'var(--text-muted)',
              border: text.trim() ? 'none' : '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.8rem 1.6rem',
              fontSize: '0.92rem',
              fontWeight: 900,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: text.trim() ? '0 6px 20px rgba(13,148,136,0.35)' : 'none',
              transform: text.trim() ? 'scale(1)' : 'scale(0.98)'
            }}
            onMouseEnter={(e) => {
              if (text.trim()) {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(13,148,136,0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (text.trim()) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,148,136,0.35)';
              }
            }}
          >
            <span>Publicar Anónimamente</span>
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
