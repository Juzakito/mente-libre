import React, { useState } from 'react';
import { X, Send, ShieldCheck, Tag, Sparkles, Heart, AlertCircle, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';

const MOOD_OPTIONS = [
  { id: 'abrumado', label: 'Abrumado', emoji: '😔', color: '#ffb74d' },
  { id: 'tranquilo', label: 'En Calma', emoji: '🌿', color: '#81c784' },
  { id: 'reflexivo', label: 'Reflexivo', emoji: '💡', color: '#64b5f6' },
  { id: 'motivado', label: 'Motivado', emoji: '⚡', color: '#ffd54f' },
  { id: 'estres', label: 'Estrés Uni', emoji: '🎒', color: '#e57373' },
  { id: 'desahogo', label: 'Desahogo', emoji: '💚', color: '#00e676' }
];

const SUGGESTED_TAGS = [
  '#Desahogo',
  '#Parciales',
  '#Ansiedad',
  '#Universidad',
  '#Consejos',
  '#Amistad',
  '#Motivación'
];

export default function ComposePostModal({ onClose, onPublish }) {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
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
    const finalTags = [selectedMood.label, ...selectedTags];
    onPublish(text.trim(), finalTags, selectedMood.id);
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
        backgroundColor: 'rgba(8, 12, 14, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
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
          maxWidth: '620px',
          backgroundColor: '#161b1e',
          border: '1px solid rgba(0, 230, 118, 0.22)',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 230, 118, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          color: '#ffffff'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#20272b',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem'
            }}>
              {user?.avatar || '🦊'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                  {user?.nickname || 'Estudiante Anónimo'}
                </span>
                <span style={{
                  backgroundColor: 'rgba(0, 230, 118, 0.15)',
                  color: '#00e676',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <ShieldCheck size={12} /> Anónimo
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#8e9ca0' }}>
                {user?.career || 'Universidad'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#a0aab0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#a0aab0'; }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Mood Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8e9ca0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
              ¿Cómo te sientes en este momento?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMood.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(0, 230, 118, 0.12)' : '#202629',
                      border: isSelected ? '1px solid #00e676' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      padding: '0.4rem 0.75rem',
                      color: isSelected ? '#ffffff' : '#a0aab0',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
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
              placeholder="¿Qué hay en tu mente? Desahógate libremente sin juzgar ni ser juzgado..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '140px',
                backgroundColor: '#1b2124',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1rem',
                fontSize: '1rem',
                color: '#ffffff',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0, 230, 118, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              autoFocus
            />

            {/* Character counter */}
            <div style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.85rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: text.length > 450 ? '#ff5252' : '#8e9ca0',
              pointerEvents: 'none'
            }}>
              {text.length}/500
            </div>
          </div>

          {/* AI Safety Banner (if sensitive phrase typed) */}
          {isCrisisDetected && (
            <div style={{
              backgroundColor: 'rgba(0, 230, 118, 0.12)',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <Heart size={20} color="#00e676" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#00e676', display: 'block', marginBottom: '0.2rem' }}>
                  No estás solo 💚
                </span>
                <span style={{ fontSize: '0.78rem', color: '#c5d2d6', lineHeight: 1.4, display: 'block' }}>
                  Si estás pasando por un momento muy difícil, recuerda que en la plataforma contamos con psicólogos y líneas de ayuda 24/7 en el Centro de Bienestar.
                </span>
              </div>
            </div>
          )}

          {/* Suggested Tags Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8e9ca0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={13} color="#00e676" /> Añadir Etiquetas
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
                      backgroundColor: active ? 'rgba(0, 230, 118, 0.2)' : '#202629',
                      border: active ? '1px solid #00e676' : '1px solid transparent',
                      color: active ? '#69f0ae' : '#8e9ca0',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.65rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
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
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#8e9ca0', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="#00e676" /> Visible en el feed global
            </span>
          </div>

          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? 'linear-gradient(135deg, #00e676 0%, #00c853 100%)' : '#282f33',
              color: text.trim() ? '#082e30' : '#5c696e',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.65rem 1.4rem',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: text.trim() ? '0 4px 16px rgba(0, 230, 118, 0.35)' : 'none',
              transition: 'all 0.2s ease'
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
