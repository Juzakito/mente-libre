import React, { useState } from 'react';
import { X, Send, ShieldCheck, Tag, Sparkles, Heart, Lock, AlertCircle, Leaf, MessageCircle, Lightbulb, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import AppleEmoji from '../../../components/ui/AppleEmoji';

const getIntentionOptions = (t) => [
  { id: 'vent', label: t('compose.intentions.vent', 'Desahogo libre'), icon: Leaf, color: 'var(--accent-emerald)' },
  { id: 'emotion', label: t('compose.intentions.emotion', 'Expresar emoción'), icon: MessageCircle, color: 'var(--accent-blue)' },
  { id: 'advice', label: t('compose.intentions.advice', 'Buscar consejo'), icon: Lightbulb, color: 'var(--accent-amber)' },
  { id: 'reflection', label: t('compose.intentions.reflection', 'Reflexión universitaria'), icon: GraduationCap, color: 'var(--accent-purple)' }
];

const getSuggestedTags = (t) => [
  t('compose.tags.vent', '#Desahogo'),
  t('compose.tags.exams', '#Exámenes'),
  t('compose.tags.anxiety', '#Ansiedad'),
  t('compose.tags.firstYear', '#PrimerAño'),
  t('compose.tags.tips', '#Consejos'),
  t('compose.tags.friendship', '#Amistad'),
  t('compose.tags.motivation', '#Motivación'),
  t('compose.tags.loneliness', '#Soledad'),
  t('compose.tags.future', '#Futuro')
];

export default function ComposePostModal({ onClose, onPublish }) {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const INTENTION_OPTIONS = getIntentionOptions(t);
  const SUGGESTED_TAGS = getSuggestedTags(t);
  const [text, setText] = useState('');
  const [selectedIntention, setSelectedIntention] = useState(INTENTION_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState([t('compose.tags.vent', '#Desahogo')]);

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
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AppleEmoji emoji={user?.avatar || '🦊'} size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  {user?.nickname || 'Estudiante Anónimo'}
                </span>
                <span style={{
                  color: 'var(--primary)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}>
                  <ShieldCheck size={12} strokeWidth={2.5} /> {t('compose.anonymousBadge', '100% Anónimo')}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {user?.career || t('compose.community', 'Comunidad Universitaria')}
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
        <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--surface)' }}>
          
          {/* Privacy Guarantee Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--surface-hover)'
          }}>
            <Lock size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t('compose.secure', 'Seguro:')}</strong> {t('compose.privacyNotice', 'Tu identidad nunca se vincula a esta publicación.')}
            </span>
          </div>

          {/* Emotional Intention Selector */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'block' }}>
              {t('compose.intentionLabel', '¿Qué buscas con esta publicación?')}
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
                      flex: '1 1 calc(50% - 0.35rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem',
                      backgroundColor: isSelected ? `${m.color}15` : 'transparent',
                      border: `1px solid ${isSelected ? m.color : 'var(--border-color)'}`,
                      borderRadius: '12px',
                      color: isSelected ? m.color : 'var(--text-muted)',
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <m.icon size={16} strokeWidth={isSelected ? 2.5 : 2} color={isSelected ? m.color : 'var(--text-muted)'} />
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
              placeholder={t('compose.placeholder', 'Escribe libremente sobre lo que estás viviendo...')}
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '100px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                padding: '0.5rem 0',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
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
                  {t('compose.safetyTitle', 'Soporte Inmediato Disponible')}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, display: 'block' }}>
                  {t('compose.safetyDesc', 'Detectamos que estás pasando por un momento muy difícil. Recuerda que no estás solo. Tienes acceso al')} <strong>{t('compose.sosButton', 'Botón S.O.S')}</strong> {t('compose.safetyDesc2', 'para ayuda clínica gratuita 24/7 en el panel principal.')}
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
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface)',
          position: 'relative',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <Sparkles size={14} color="var(--primary)" /> Comunidad
          </span>

          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? 'var(--primary)' : 'var(--surface-hover)',
              color: text.trim() ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            Publicar Anónimamente
            <Send size={14} style={{ marginLeft: '0.2rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
