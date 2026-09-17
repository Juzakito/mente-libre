import React, { useState } from 'react';
import { X, Send, ShieldCheck, Tag, Sparkles, Heart, Lock, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';

const INTENTION_OPTIONS = [
  { id: 'desahogo', label: 'Desahogo libre', emoji: '🌿' },
  { id: 'abrumado', label: 'Expresar emoción', emoji: '💭' },
  { id: 'consejo', label: 'Buscar consejo', emoji: '💡' },
  { id: 'reflexion', label: 'Reflexión universitaria', emoji: '🎓' }
];

const SUGGESTED_TAGS = [
  '#Desahogo',
  '#Exámenes',
  '#Ansiedad',
  '#PrimerAño',
  '#Consejos',
  '#Amistad',
  '#Motivación'
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
      setSelectedTags([...selectedTags, tag]);
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
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          color: 'var(--text-main)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface-hover)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              {user?.avatar || '🦉'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {user?.nickname || 'Estudiante Anónimo'}
                </span>
                <span style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <ShieldCheck size={12} /> Publicación Anónima
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {user?.career || 'Universidad'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Privacy Guarantee Banner */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <Lock size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              <strong>Garantía de Privacidad:</strong> Tu correo e identidad personal nunca se vinculan a esta publicación.
            </span>
          </div>

          {/* Emotional Intention Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'block' }}>
              Intención de tu publicación
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {INTENTION_OPTIONS.map((m) => {
                const isSelected = selectedIntention.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedIntention(m)}
                    style={{
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-color)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '0.5rem 0.75rem',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.84rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe libremente sobre lo que estás viviendo. Este es un espacio seguro y respetuoso..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '130px',
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.55,
                boxSizing: 'border-box'
              }}
              autoFocus
            />

            {/* Character counter */}
            <div style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.85rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: text.length > 450 ? 'var(--accent-rose)' : 'var(--text-light)',
              pointerEvents: 'none'
            }}>
              {text.length}/500
            </div>
          </div>

          {/* AI Safety Banner (if sensitive phrase typed) */}
          {isCrisisDetected && (
            <div style={{
              backgroundColor: 'var(--bg-danger)',
              border: '1px solid var(--border-danger)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <Heart size={20} color="var(--accent-rose)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-rose)', display: 'block', marginBottom: '0.2rem' }}>
                  Soporte Inmediato Disponible 💚
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, display: 'block' }}>
                  Detectamos que estás pasando por un momento abrumador. En Free Mind dispones del botón S.O.S de ayuda clínica gratuita 24/7.
                </span>
              </div>
            </div>
          )}

          {/* Suggested Tags Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={13} color="var(--primary)" /> Temas Sugeridos
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
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
          padding: '1rem 1.4rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface-hover)'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--primary)" /> Publicación moderada por la comunidad
          </span>

          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            style={{
              backgroundColor: text.trim() ? 'var(--primary)' : 'var(--border-color)',
              color: text.trim() ? '#ffffff' : 'var(--text-light)',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.65rem 1.4rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>Publicar Anónimamente</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

