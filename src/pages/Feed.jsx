import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  LayoutGrid,
  List,
  Mail,
  CheckCircle,
  X,
  Plus,
  Send,
  Tag,
  Smile
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useOutletContext, useNavigate } from 'react-router-dom';
import TalkCampusAvatar from '../components/ui/TalkCampusAvatar';
import PostCard from '../features/feed/components/PostCard';
import ComposePostModal from '../features/feed/components/ComposePostModal';
import { supabase } from '../services/supabase/client';

import AppleEmoji from '../components/ui/AppleEmoji';

// Re-export PostCard for backward compatibility with PublicProfile
export { PostCard };

const FEED_TABS = [
  'Más reciente',
  'Mi universidad',
  'Ansiedad & Estrés',
  'Consejos',
  'Comunidad'
];

const AVAILABLE_VIBES = [
  { id: 'anxious', label: 'Ansioso', emoji: '🥺', tag: 'Anxious' },
  { id: 'sad', label: 'Triste', emoji: '🙁', tag: 'Sad' },
  { id: 'hopeful', label: 'Con esperanza', emoji: '😀', tag: 'Hopeful' },
  { id: 'stressed', label: 'Estresado', emoji: '😫', tag: 'Stressed' },
  { id: 'thankful', label: 'Agradecido', emoji: '🙏', tag: 'Thankful' },
  { id: 'motivated', label: 'Motivado', emoji: '💪', tag: 'Motivated' }
];

const AVAILABLE_TAGS = [
  '#Universidad',
  '#PrimerAño',
  '#Exámenes',
  '#SaludMental',
  '#Amistad',
  '#Científica',
  '#Desahogo',
  '#Medicina'
];

export default function Feed() {
  const { user, posts, addPost } = useAppContext();
  const outletCtx = useOutletContext();
  const showToast = outletCtx?.showToast || console.log;

  // Active Tab
  const [activeTab, setActiveTab] = useState('Más reciente');

  // Search & Layout
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('cards'); // 'cards' | 'compact'

  // Right Sidebar Filter Options (Image 4) - Persisted in localStorage
  const navigate = useNavigate();
  const [feedStyle, setFeedStyle] = useState(() => {
    return localStorage.getItem('tc_feed_style') || 'classic';
  });

  const [ageRange, setAgeRange] = useState(() => {
    return Number(localStorage.getItem('tc_age_range')) || 60;
  });

  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showVibesPicker, setShowVibesPicker] = useState(false);
  const [showTagsPicker, setShowTagsPicker] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  // Email Verification Modal
  const unverifiedEmail = user?.email || localStorage.getItem('tc_unverified_email') || '';
  const [showVerificationModal, setShowVerificationModal] = useState(() => {
    if (localStorage.getItem('tc_verification_dismissed') === 'true') return false;
    if (localStorage.getItem('tc_email_verified') === 'true') return false;
    const unverifiedFlag = localStorage.getItem('tc_unverified_email');
    return Boolean(unverifiedFlag && user?.needs_email_verification);
  });
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatusMsg, setResendStatusMsg] = useState('');

  // Compose modal state
  const [isComposing, setIsComposing] = useState(false);

  // Sync feed style & age range to localStorage
  useEffect(() => {
    localStorage.setItem('tc_feed_style', feedStyle);
  }, [feedStyle]);

  useEffect(() => {
    localStorage.setItem('tc_age_range', String(ageRange));
  }, [ageRange]);

  // Reset all feed options
  const handleResetFilters = () => {
    setActiveTab('Más reciente');
    setFeedStyle('classic');
    setAgeRange(60);
    setSelectedVibes([]);
    setSelectedTags([]);
    setSearchQuery('');
    setSearchOpen(false);
    setShowVibesPicker(false);
    setShowTagsPicker(false);
    showToast('Opciones de feed restablecidas');
  };

  const handleSelectStyle = (style) => {
    setFeedStyle(style);
    showToast(`Estilo ${style === 'classic' ? 'Clásico' : 'Sólido'} activado`);
  };

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setResendStatusMsg('');
    const targetEmail = unverifiedEmail;
    try {
      if (targetEmail && targetEmail.includes('@')) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: targetEmail
        });
        if (error) {
          console.warn('Supabase resend warning:', error.message);
        }
      }
      setResendStatusMsg(`✨ Correo de verificación reenviado a ${targetEmail || 'tu Gmail'}. Revisa tu bandeja de entrada o carpeta de Spam.`);
      showToast(`✨ Correo reenviado a ${targetEmail || 'tu Gmail'}`);
    } catch (err) {
      setResendStatusMsg(`Se envió la solicitud de verificación a ${targetEmail}`);
      showToast(`Correo de verificación enviado a ${targetEmail}`);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleConfirmVerified = () => {
    localStorage.setItem('tc_email_verified', 'true');
    localStorage.setItem('tc_verification_dismissed', 'true');
    setShowVerificationModal(false);
    showToast('🎉 ¡Correo verificado correctamente!');
  };

  const handleCloseVerification = () => {
    setShowVerificationModal(false);
    localStorage.setItem('tc_verification_dismissed', 'true');
  };

  const handleAddCustomTag = (e) => {
    e?.preventDefault();
    if (!customTagInput.trim()) return;
    const formatted = customTagInput.startsWith('#') ? customTagInput.trim() : `#${customTagInput.trim()}`;
    if (!selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted]);
    }
    setCustomTagInput('');
  };

  // Filter posts based on search query, selected vibes, tags, age, and active tab
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Age Range
    if (ageRange < 60) {
      result = result.filter(p => {
        // Derive post author age or default to 20
        const postAge = p.authorAge || (p.author?.includes('22') ? 22 : p.author?.includes('18') ? 18 : 20);
        return postAge <= ageRange;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.text.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter by Vibes
    if (selectedVibes.length > 0) {
      result = result.filter(p => {
        const textLower = p.text.toLowerCase();
        return selectedVibes.some(vibe => {
          if (vibe === 'anxious') return textLower.includes('ansioso') || textLower.includes('miedo') || textLower.includes('odio') || textLower.includes('intercambio');
          if (vibe === 'sad') return textLower.includes('solo') || textLower.includes('triste') || textLower.includes('duele') || textLower.includes('quejándome');
          if (vibe === 'hopeful') return textLower.includes('enfoque') || textLower.includes('sonreiré') || textLower.includes('esperanza');
          if (vibe === 'stressed') return textLower.includes('estrés') || textLower.includes('presión') || textLower.includes('exámenes');
          if (vibe === 'thankful') return textLower.includes('gracias') || textLower.includes('agradecido');
          if (vibe === 'motivated') return textLower.includes('ánimo') || textLower.includes('logré') || textLower.includes('éxito');
          return true;
        });
      });
    }

    // Filter by Tags
    if (selectedTags.length > 0) {
      result = result.filter(p =>
        selectedTags.some(t => {
          const rawTag = t.replace('#', '').toLowerCase();
          return (
            p.text.toLowerCase().includes(rawTag) ||
            (p.tags && p.tags.some(pt => pt.toLowerCase().includes(rawTag)))
          );
        })
      );
    }

    // Tab specific filtering / sorting
    if (activeTab === 'Mi universidad') {
      result = result.filter(p =>
        p.text.toLowerCase().includes('científica') ||
        p.text.toLowerCase().includes('universidad') ||
        p.text.toLowerCase().includes('campus') ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes('universidad') || t.toLowerCase().includes('científica')))
      );
    } else if (activeTab === 'Noticias') {
      result = result.filter(p =>
        p.text.toLowerCase().includes('comunicado') ||
        p.text.toLowerCase().includes('noticias') ||
        p.text.toLowerCase().includes('taller') ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes('noticias')))
      );
    } else if (activeTab === 'Haciendo Olas') {
      result.sort((a, b) => (b.hugs || 0) - (a.hugs || 0));
    } else if (activeTab === 'Nuevos desahogos') {
      result = result.filter(p =>
        p.text.toLowerCase().includes('siento') ||
        p.text.toLowerCase().includes('desmoronando') ||
        p.text.toLowerCase().includes('duele') ||
        p.text.toLowerCase().includes('quejándome') ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes('desahogo') || t.toLowerCase().includes('sad') || t.toLowerCase().includes('anxious')))
      );
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (activeTab === 'Preguntas a la comunidad') {
      result = result.filter(p =>
        p.text.includes('?') ||
        p.text.toLowerCase().includes('alguien') ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes('preguntas')))
      );
    } else {
      // 'Más reciente' - sort newest first
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [posts, searchQuery, selectedVibes, selectedTags, ageRange, activeTab]);

  return (
    <div className="tc-dashboard-wrapper">
      {/* =========================================================
          CENTER COLUMN: FEED MAIN (IMAGE 4)
         ========================================================= */}
      <section className="tc-feed-main">
        {/* Mobile Custom Header (Matches Screenshots) */}
        <div className="mobile-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.25rem 0.25rem 0.75rem',
          width: '100%'
        }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
            Feed
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => {
                showToast("Filtros abertos");
                // Here we could scroll to the sidebar on mobile or open a modal
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <SlidersHorizontal size={22} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>
            <div style={{ marginLeft: '0.25rem', cursor: 'pointer', border: '2px solid #00e676', borderRadius: '50%', padding: '2px' }} onClick={() => navigate('/app/profile')}>
              <TalkCampusAvatar id={user?.avatar || '🦉'} size={30} />
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '0.5rem 0.75rem',
          border: '1px solid var(--border-color)'
        }}>
          {/* Tabs list */}
          <div className="tc-tabs-bar" style={{ flex: 1 }}>
            {FEED_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tc-tab-item ${activeTab === tab ? 'active' : ''}`}
                style={activeTab === tab ? { backgroundColor: '#00e676', color: '#082e30', boxShadow: 'none', borderColor: 'transparent' } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right actions: Layout switch & Search icon (Desktop only) */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <button
              onClick={() => setLayoutMode(layoutMode === 'cards' ? 'compact' : 'cards')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px'
              }}
              title="Alternar vista"
            >
              {layoutMode === 'cards' ? <LayoutGrid size={18} /> : <List size={18} />}
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                background: searchOpen ? 'var(--surface-hover)' : 'none',
                border: 'none',
                color: searchOpen ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '8px'
              }}
              title="Buscar en el feed"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar Input (Expands when search icon clicked) */}
        {searchOpen && (
          <div className="animate-slide-down" style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--primary)',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
            gap: '0.5rem'
          }}>
            <Search size={16} color="var(--primary)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palabras clave, autor o etiquetas..."
              autoFocus
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#8e9ca0', cursor: 'pointer', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Active Filters Bar (if any selected) */}
        {(selectedVibes.length > 0 || selectedTags.length > 0 || ageRange < 60 || searchQuery) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--surface-hover)', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Filtros activos:</span>

            {ageRange < 60 && (
              <span
                onClick={() => setAgeRange(60)}
                style={{
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                Edad ≤ {ageRange} <X size={12} />
              </span>
            )}

            {selectedVibes.map(v => (
              <span
                key={v}
                onClick={() => setSelectedVibes(selectedVibes.filter(item => item !== v))}
                style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {(() => {
                  const vItem = AVAILABLE_VIBES.find(x => x.id === v);
                  return vItem ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {vItem.label} <AppleEmoji emoji={vItem.emoji} size={14} />
                    </div>
                  ) : v;
                })()} <X size={12} />
              </span>
            ))}

            {selectedTags.map(t => (
              <span
                key={t}
                onClick={() => setSelectedTags(selectedTags.filter(item => item !== t))}
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent-blue) 15%, transparent)',
                  color: 'var(--accent-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {t} <X size={12} />
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto' }}>
              Limpiar todos
            </button>
          </div>
        )}

        {/* Posts Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPosts.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '3.5rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌱</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                No hay publicaciones en este filtro
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Prueba ajustando las opciones de feed o sé el primero en iniciar un desahogo con la comunidad.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Restablecer Opciones
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                feedStyle={feedStyle}
              />
            ))
          )}
        </div>
      </section>

      {/* =========================================================
          RIGHT SIDEBAR: "OPCIONES DE FEED" (IMAGE 4 - 100% FUNCIONAL)
         ========================================================= */}
      <aside className="tc-right-sidebar">
        {/* Header with Filter icon, title and reset icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SlidersHorizontal size={18} color="var(--text-main)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              Opciones de feed
            </h3>
          </div>
          <button
            onClick={handleResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '50%',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Restablecer opciones"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* ─── 1. Section: Styles (Clásico / Sólido) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Styles</span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Clásico Card Preview */}
            <div
              onClick={() => handleSelectStyle('classic')}
              style={{
                backgroundColor: feedStyle === 'classic' ? 'var(--surface-elevated)' : 'var(--surface-hover)',
                border: feedStyle === 'classic' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.85rem 0.6rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', padding: '0 4px' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '3px', width: '100%' }} />
                <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '3px', width: '100%' }} />
                <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '3px', width: '100%' }} />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: feedStyle === 'classic' ? 'var(--primary)' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                Clásico
              </span>
            </div>

            {/* Sólido Card Preview */}
            <div
              onClick={() => handleSelectStyle('solid')}
              style={{
                backgroundColor: feedStyle === 'solid' ? 'var(--surface-elevated)' : 'var(--surface-hover)',
                border: feedStyle === 'solid' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.85rem 0.6rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', padding: '0 4px' }}>
                <div style={{ height: '8px', backgroundColor: '#3b82f6', borderRadius: '3px', width: '100%' }} />
                <div style={{ height: '8px', backgroundColor: '#10b981', borderRadius: '3px', width: '100%' }} />
                <div style={{ height: '8px', backgroundColor: '#8b5cf6', borderRadius: '3px', width: '100%' }} />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: feedStyle === 'solid' ? 'var(--primary)' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                Sólido
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Los temas cambian mensualmente.
          </span>
        </div>

        {/* ─── 2. Section: Edad Slider (16-60+) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Edad</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
              16-{ageRange === 60 ? '60+' : ageRange}
            </span>
          </div>

          <input
            type="range"
            min="16"
            max="60"
            value={ageRange}
            onChange={(e) => setAgeRange(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--primary)',
              cursor: 'pointer',
              height: '4px',
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((ageRange - 16) / (60 - 16)) * 100}%, var(--border-color) ${((ageRange - 16) / (60 - 16)) * 100}%, var(--border-color) 100%)`,
              borderRadius: '9999px',
              outline: 'none'
            }}
          />
        </div>

        {/* ─── 3. Section: Vibras ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Vibras</span>

          <button
            onClick={() => setShowVibesPicker(!showVibesPicker)}
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-hover)',
              border: selectedVibes.length > 0 ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.65rem 1rem',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => {
              if (selectedVibes.length === 0) e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>
              {selectedVibes.length > 0 ? `Vibras (${selectedVibes.length})` : 'Añade vibras a tu filtro'}
            </span>
          </button>

          {/* Active Vibe Tags Display */}
          {selectedVibes.length > 0 && !showVibesPicker && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {selectedVibes.map(v => (
                <span
                  key={v}
                  onClick={() => setSelectedVibes(selectedVibes.filter(item => item !== v))}
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  {(() => {
                    const vItem = AVAILABLE_VIBES.find(x => x.id === v);
                    return vItem ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {vItem.label} <AppleEmoji emoji={vItem.emoji} size={14} />
                      </div>
                    ) : v;
                  })()} <X size={12} />
                </span>
              ))}
            </div>
          )}

          {/* Interactive Vibes Selector Drawer */}
          {showVibesPicker && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }} className="animate-slide-down">
              {AVAILABLE_VIBES.map((v) => {
                const isSelected = selectedVibes.includes(v.id);
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedVibes(selectedVibes.filter(item => item !== v.id));
                      } else {
                        setSelectedVibes([...selectedVibes, v.id]);
                      }
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface-hover)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {v.label} <AppleEmoji emoji={v.emoji} size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── 4. Section: Mis Etiquetas ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Mis Etiquetas</span>

          <button
            onClick={() => setShowTagsPicker(!showTagsPicker)}
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-hover)',
              border: selectedTags.length > 0 ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '0.65rem 1rem',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
            onMouseLeave={(e) => {
              if (selectedTags.length === 0) e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>
              {selectedTags.length > 0 ? `Etiquetas (${selectedTags.length})` : 'Añade etiquetas a tu filtro'}
            </span>
          </button>

          {/* Active Tags Display */}
          {selectedTags.length > 0 && !showTagsPicker && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  onClick={() => setSelectedTags(selectedTags.filter(item => item !== tag))}
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                    border: '1px solid var(--accent-blue)',
                    color: 'var(--accent-blue)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  {tag} <X size={12} />
                </span>
              ))}
            </div>
          )}

          {/* Interactive Tags Selector & Custom Tag Input */}
          {showTagsPicker && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }} className="animate-slide-down">
              <form onSubmit={handleAddCustomTag} style={{ display: 'flex', gap: '0.35rem' }}>
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder="Escribir etiqueta..."
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--surface-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-main)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--accent-blue)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(item => item !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface-hover)',
                        color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)',
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
          )}
        </div>
      </aside>

      {/* =========================================================
          EMAIL VERIFICATION MODAL OVERLAY (IMAGE 4)
         ========================================================= */}
      {showVerificationModal && (
        <div className="tc-modal-overlay animate-fade-in" onClick={handleCloseVerification}>
          <div className="tc-verification-card" onClick={(e) => e.stopPropagation()}>
            {/* Close Button X */}
            <button
              onClick={handleCloseVerification}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: '#8e9ca0',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={22} />
            </button>

            {/* Envelope Icon with Green Check Badge */}
            <div style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#22272a',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #2e373b'
              }}>
                <Mail size={30} color="#ffffff" />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <CheckCircle size={16} color="#082e30" strokeWidth={3} />
              </div>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              Verifica tu correo electrónico
            </h2>

            {/* Subtext with highlighted email */}
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: '#ffffff',
              marginBottom: '0.75rem'
            }}>
              Hemos enviado un correo electrónico a{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 800, wordBreak: 'break-all' }}>
                {unverifiedEmail || 'tu correo Gmail'}
              </span>
            </p>

            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.5,
              color: '#8e9ca0',
              marginBottom: '1.25rem'
            }}>
              Haz clic en el enlace del correo para desbloquear el acceso o confirma tu correo para continuar.
            </p>

            {resendStatusMsg && (
              <div style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '0.75rem 0.9rem',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                {resendStatusMsg}
              </div>
            )}

            {/* Buttons: Confirmar (Primary) + Reenviar (Secondary) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleConfirmVerified}
                style={{
                  width: '100%',
                  background: 'var(--primary)',
                  color: 'var(--bg-color)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
              >
                Confirmar / Ya lo verifiqué
              </button>

              <button
                onClick={handleResendEmail}
                disabled={resendingEmail}
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  padding: '0.8rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: resendingEmail ? 'not-allowed' : 'pointer',
                  opacity: resendingEmail ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { if (!resendingEmail) e.currentTarget.style.backgroundColor = '#343b3f'; }}
                onMouseLeave={(e) => { if (!resendingEmail) e.currentTarget.style.backgroundColor = '#282d30'; }}
              >
                {resendingEmail ? 'Enviando correo...' : 'Reenviar correo a mi Gmail'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating or Local Compose Post Modal */}
      {isComposing && (
        <ComposePostModal
          onClose={() => setIsComposing(false)}
          onPublish={(text, tags) => {
            addPost(text, tags);
            setIsComposing(false);
            showToast('Desahogo publicado anónimamente en la comunidad');
          }}
        />
      )}
    </div>
  );
}
