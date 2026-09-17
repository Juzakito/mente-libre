import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Bell,
  Sparkles,
  Heart,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  GraduationCap,
  PhoneCall,
  Info,
  UserPlus,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  Plus,
  DoorOpen,
  CircleDot,
  ChevronDown,
  ChevronUp,
  Calendar,
  Map,
  Compass,
  Search,
  User,
  Coffee,
  Share2,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { useTranslation } from 'react-i18next';
import SOSModal from './SOSModal';
import ShareModal from './ShareModal';
import AIAssistant from './AIAssistant';
import TalkCampusLogo from './ui/TalkCampusLogo';
import TalkCampusAvatar from './ui/TalkCampusAvatar';
import LanguageToggle from './ui/LanguageToggle';
import GlobalAudioPlayer from './audio/GlobalAudioPlayer';
import ComposePostModal from '../features/feed/components/ComposePostModal';
import { useAppContext } from '../context/AppContext';

export default function MainLayout() {
  const { user, logout, isAuthLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addPost } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [showSOS, setShowSOS] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'salas', 'notificaciones', 'mejoras', 'dotz', 'seguridad', 'guia', 'helpline', 'acerca', 'aliado'
  const [expertDropdownOpen, setExpertDropdownOpen] = useState(() => {
    return location.pathname === '/app/expertos' || location.pathname === '/app/citas';
  });

  // ─── SIDEBAR INTERACTIVE MODALS STATE ────────────────────────
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, type: 'hug', title: '💙 FlyingJay_99 te envió un abrazo', desc: 'En tu publicación de desahogo "Exámenes finales"', time: 'hace 15m', read: false },
    { id: 2, type: 'comment', title: '🦉 Búho_Científica comentó', desc: '"¡No estás solo! Todos apoyamos aquí 💪"', time: 'hace 1h', read: false },
    { id: 3, type: 'reward', title: '🪶 +15 Plumas ganadas', desc: 'Por tu registro de estado de ánimo de hoy', time: 'hace 3h', read: false },
    { id: 4, type: 'reminder', title: '📅 Recordatorio de Cita', desc: 'Psicología Científica del Sur mañana a las 4:00 PM', time: 'hace 5h', read: true }
  ]);

  const [featureVotes, setFeatureVotes] = useState({
    oled: 142,
    audio: 98,
    workshops: 215,
    userVoted: {}
  });
  const [newProposalText, setNewProposalText] = useState('');
  const [customProposals, setCustomProposals] = useState([]);

  const [privacySettings, setPrivacySettings] = useState({
    hideCareer: false,
    allowDM: true,
    hideProfile: false
  });

  const [guideStep, setGuideStep] = useState(1);

  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingText, setBreathingText] = useState('Haz clic para iniciar ejercicio de respiración (1 min)');

  const [peerRole, setPeerRole] = useState('search');
  const [peerTopic, setPeerTopic] = useState('Exámenes y Estrés');
  const [peerMatching, setPeerMatching] = useState(false);
  const [peerMatchResult, setPeerMatchResult] = useState(null);

  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      const phases = [
        '🌬️ Inhala suavemente por la nariz...',
        '⏸️ Mantén el aire en los pulmones...',
        '😮‍💨 Exhala lentamente por la boca...'
      ];
      let step = 0;
      setBreathingText(phases[0]);
      interval = setInterval(() => {
        step = (step + 1) % phases.length;
        setBreathingText(phases[step]);
      }, 4000);
    } else {
      setBreathingText('Haz clic para iniciar ejercicio de respiración (1 min)');
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const handleUpvoteFeature = (key) => {
    if (featureVotes.userVoted[key]) {
      showToast('Ya has votado por esta característica');
      return;
    }
    setFeatureVotes(prev => ({
      ...prev,
      [key]: prev[key] + 1,
      userVoted: { ...prev.userVoted, [key]: true }
    }));
    showToast('¡Voto registrado! Gracias por apoyar las mejoras de la comunidad ⚡');
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
    showToast('¡Tu sugerencia ha sido enviada para votación! 💡');
  };

  const handleFindPeerMatch = () => {
    setPeerMatching(true);
    setPeerMatchResult(null);

    setTimeout(() => {
      setPeerMatching(false);
      setPeerMatchResult({
        nickname: 'IvoryBird_21',
        avatar: '🐱',
        career: 'Psicología UCS',
        topic: peerTopic,
        status: 'Disponible ahora'
      });
      showToast('¡Amigo encontrado! Conectando con IvoryBird_21 ✨');
    }, 2000);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAuthLoading && !user) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <div style={{ fontSize: '3rem', animation: 'pulse-soft 1.5s infinite' }}>🌱</div>
      </div>
    );
  }

  if (!user) return null;

  const currentPath = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handlePublishFromSidebar = (text, tags) => {
    addPost(text, tags);
    setShowCompose(false);
    showToast('Publicación compartida anónimamente en la comunidad');
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-main)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      {/* ─── LEFT SIDEBAR ─────────────────────────── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        height: '100%',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.15rem 0.85rem 1rem',
        overflowY: 'auto',
        zIndex: 95,
        scrollbarWidth: 'none',
        position: 'relative'
      }} className={`desktop-sidebar no-scrollbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>

        {/* Top Brand Header: Logo + CONECTADO status + Language Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/app/feed')}>
              <TalkCampusLogo size={28} showText subtitle="CONECTADO" textColor="var(--text-main)" />
            </div>
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* + PUBLICACIÓN BUTTON WITH HOPE TOOLTIP BANNER */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCompose(true)}
              style={{
                width: '100%',
                backgroundColor: '#00e676',
                color: '#082e30',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0, 230, 118, 0.4)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00c853'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00e676'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Plus size={18} strokeWidth={3} />
              <span>Crear Publicación</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.1rem' }}>
            <LanguageToggle />
          </div>
        </div>

        {/* Navigation Links matched 100% with reference bar */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
          <SidebarButton
            icon={<Home size={18} />}
            label="Feed"
            active={currentPath === '/app/feed'}
            onClick={() => handleNavClick('/app/feed')}
          />
          <SidebarButton
            icon={<DoorOpen size={18} />}
            label="Salas"
            onClick={() => setActiveInfoModal('salas')}
          />
          <SidebarButton
            icon={<MessageCircle size={18} />}
            label="Mensajes"
            active={currentPath === '/app/chat'}
            onClick={() => handleNavClick('/app/chat')}
          />
          <SidebarButton
            icon={<Bell size={18} />}
            label="Notificaciones"
            onClick={() => setActiveInfoModal('notificaciones')}
          />

          <div style={{ margin: '0.4rem 0', height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />

          <SidebarButton
            icon={<Zap size={18} color="#fbbf24" />}
            label="Mejoras"
            onClick={() => setActiveInfoModal('mejoras')}
          />
          <SidebarButton
            icon={<Sparkles size={18} color="#a855f7" />}
            label="Centro de Bienestar"
            active={currentPath === '/app/mood'}
            onClick={() => handleNavClick('/app/mood')}
          />
          <SidebarButton
            icon={<CircleDot size={18} color="#38bdf8" />}
            label="Dotz (Plumas)"
            onClick={() => setActiveInfoModal('dotz')}
          />
          <SidebarButton
            icon={<ShieldCheck size={18} color="#10b981" />}
            label="Centro de Seguridad"
            onClick={() => setActiveInfoModal('seguridad')}
          />
          <SidebarButton
            icon={<ShieldAlert size={18} color="#f43f5e" />}
            label="Necesito ayuda"
            onClick={() => setShowSOS(true)}
            accentColor="#f43f5e"
          />
          <SidebarButton
            icon={<Compass size={18} />}
            label="Guía de uso"
            onClick={() => setActiveInfoModal('guia')}
          />
          <SidebarButton
            icon={<GraduationCap size={18} />}
            label="Servicios Estudiantiles"
            active={currentPath === '/app/expertos' || currentPath === '/app/citas'}
            onClick={() => handleNavClick('/app/expertos')}
          />
          <SidebarButton
            icon={<PhoneCall size={18} color="#f43f5e" />}
            label="Línea de ayuda clínica"
            onClick={() => setActiveInfoModal('helpline')}
          />
          <SidebarButton
            icon={<Info size={18} />}
            label="Acerca de Free Mind"
            onClick={() => setActiveInfoModal('acerca')}
          />
          <SidebarButton
            icon={<UserPlus size={18} color="#00e676" />}
            label="Hazte un Amigo"
            onClick={() => setActiveInfoModal('aliado')}
          />
        </nav>

        {/* Bottom Section: Theme Toggle + User Profile Card Footer */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Theme & Share Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                flex: 1,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '0.45rem 0.75rem',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {theme === 'light' ? <Moon size={14} color="#38bdf8" /> : <Sun size={14} color="#f59e0b" />}
              <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
            </button>

            <button
              onClick={() => setShowShare(true)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              title="Compartir"
            >
              <Share2 size={15} />
            </button>
          </div>

          {/* User Card at bottom */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0.75rem',
            borderRadius: '16px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', cursor: 'pointer' }} onClick={() => handleNavClick('/app/profile')}>
              <TalkCampusAvatar id={user?.avatar || '🦉'} size={34} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.nickname || 'Estudiante'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00e676', fontWeight: 700 }}>
                  Novato · UCS
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s'
              }}
              title="Cerrar sesión"
              onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEWPORT ───────────────────────────── */}
      <main style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Mobile Header (Hidden on desktop) */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border-color)'
        }} className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                backgroundColor: '#1b2022',
                border: '1px solid #283033',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <Menu size={18} />
            </button>
            <TalkCampusLogo size={24} showText={false} />
          </div>

          <button
            onClick={() => setShowCompose(true)}
            style={{
              backgroundColor: '#00e676',
              color: '#082e30',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={14} strokeWidth={3} />
            <span>Publicar</span>
          </button>
        </header>

        {/* Center Routed View (Feed, Chat, Profile, etc.) */}
        <div style={{ flex: 1 }}>
          <Outlet context={{ handleSOS: () => setShowSOS(true), showToast, openCompose: () => setShowCompose(true) }} />
        </div>
      </main>

      {/* ─── TOAST NOTIFICATIONS ─────────────────────────────── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#181c1e',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '9999px',
          border: '1px solid #00e676',
          boxShadow: '0 8px 30px rgba(0, 230, 118, 0.25)',
          zIndex: 9999,
          fontSize: '0.9rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }} className="animate-slide-up">
          <span style={{ color: '#00e676' }}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── MODALS ─────────────────────────────────────────── */}
      {/* 1. Compose Post Modal */}
      {showCompose && (
        <ComposePostModal
          onClose={() => setShowCompose(false)}
          onPublish={handlePublishFromSidebar}
        />
      )}

      {/* 2. S.O.S Emergency Modal */}
      {showSOS && <SOSModal reason="manual" onClose={() => setShowSOS(false)} />}

      {/* 3. Share / Invite a Friend Modal */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* 4. Generic Sidebar Info Modals */}
      {activeInfoModal && (
        <div className="tc-modal-overlay animate-fade-in" onClick={() => setActiveInfoModal(null)}>
          <div className="tc-verification-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveInfoModal(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#8e9ca0', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {activeInfoModal === 'salas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0, 230, 118, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    flexShrink: 0
                  }}>
                    🚪
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                      Salas Comunitarias
                    </h3>
                    <p style={{ color: '#9ba7ac', fontSize: '0.84rem', margin: '0.15rem 0 0', lineHeight: 1.35 }}>
                      Encuentra compañeros y conversaciones anónimas en tiempo real
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.2rem' }}>
                  {[
                    { id: 'primer_ano', name: '🌱 Primeros Ciclos Universitarios', topic: 'Adaptación, profesores y vida en el campus', users: 38, tag: '#PrimerAño' },
                    { id: 'examenes', name: '📚 Preparación de Exámenes', topic: 'Desahogo y grupos de estudio sin estrés', users: 52, tag: '#ExámenesFinales' },
                    { id: 'salud_mental', name: '🧠 Manejo de la Ansiedad', topic: 'Espacio de escucha y apoyo guiado', users: 24, tag: '#SaludMental' },
                    { id: 'desahogo', name: '💬 Desahogo Libre 24/7', topic: 'Exprésate sin filtros de forma anónima', users: 19, tag: '#DesahogoLibre' }
                  ].map((room) => (
                    <div
                      key={room.id}
                      style={{
                        padding: '1rem 1.15rem',
                        borderRadius: '16px',
                        backgroundColor: '#1f262a',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.35)';
                        e.currentTarget.style.backgroundColor = '#242c31';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.backgroundColor = '#1f262a';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span>{room.name}</span>
                          <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(0, 230, 118, 0.15)', color: '#00e676', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            🟢 {room.users} en vivo
                          </span>
                        </div>
                        <span style={{ color: '#9ba7ac', fontSize: '0.8rem', lineHeight: 1.35 }}>{room.topic}</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveInfoModal(null);
                          showToast(`Conectado a la sala ${room.tag} ✨`);
                          navigate('/app/chat', { state: { activeRoom: room } });
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #00e676 0%, #00c853 100%)',
                          color: '#082e30',
                          border: 'none',
                          padding: '0.55rem 1.15rem',
                          borderRadius: '9999px',
                          fontWeight: 900,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 14px rgba(0, 230, 118, 0.35)',
                          flexShrink: 0,
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Unirme →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeInfoModal === 'notificaciones' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '2rem' }}>🔔</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Notificaciones</h3>
                  </div>
                  {notificationsList.length > 0 && (
                    <button
                      onClick={() => {
                        setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
                        showToast('Todas las notificaciones marcadas como leídas');
                      }}
                      style={{ background: 'none', border: 'none', color: '#00e676', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                {notificationsList.length === 0 ? (
                  <p style={{ color: '#9ba7ac', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem 0' }}>
                    No tienes notificaciones pendientes ✨
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notificationsList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                          if (item.type === 'hug' || item.type === 'comment') navigate('/app/feed');
                          if (item.type === 'reward') navigate('/app/profile');
                          if (item.type === 'reminder') navigate('/app/citas');
                          setActiveInfoModal(null);
                        }}
                        style={{
                          backgroundColor: item.read ? '#1f262a' : 'rgba(0, 230, 118, 0.08)',
                          padding: '0.85rem 1rem',
                          borderRadius: '14px',
                          border: item.read ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0, 230, 118, 0.35)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: item.read ? '#ffffff' : '#00e676', marginBottom: '2px' }}>
                          {item.title}
                        </div>
                        <div style={{ color: '#9ba7ac', fontSize: '0.78rem' }}>{item.desc}</div>
                        <div style={{ color: '#697a80', fontSize: '0.7rem', marginTop: '4px' }}>{item.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeInfoModal === 'mejoras' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>⚡</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Mejoras de la Plataforma</h3>
                    <p style={{ color: '#9ba7ac', fontSize: '0.82rem', margin: 0 }}>¡Vota por las funciones que deseas ver primero!</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { key: 'oled', icon: '🌙', title: 'Modo Nocturno Profundo OLED', votes: featureVotes.oled },
                    { key: 'audio', icon: '🎙️', title: 'Salas de Audio Anónimas 24/7', votes: featureVotes.audio },
                    { key: 'workshops', icon: '🧘', title: 'Talleres de Manejo de Ansiedad', votes: featureVotes.workshops }
                  ].map((feat) => (
                    <div
                      key={feat.key}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: '#1f262a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{feat.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#ffffff' }}>{feat.title}</span>
                      </div>
                      <button
                        onClick={() => handleUpvoteFeature(feat.key)}
                        style={{
                          backgroundColor: featureVotes.userVoted[feat.key] ? '#00e676' : 'rgba(255, 255, 255, 0.08)',
                          color: featureVotes.userVoted[feat.key] ? '#082e30' : '#ffffff',
                          border: 'none',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '9999px',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <ThumbsUp size={13} />
                        <span>{feat.votes}</span>
                      </button>
                    </div>
                  ))}

                  {customProposals.map((prop) => (
                    <div
                      key={prop.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(0, 230, 118, 0.08)',
                        border: '1px solid rgba(0, 230, 118, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#00e676' }}>💡 {prop.title}</span>
                      <span style={{ fontSize: '0.78rem', color: '#00e676', fontWeight: 800 }}>En revisión</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddProposal} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input
                    type="text"
                    value={newProposalText}
                    onChange={(e) => setNewProposalText(e.target.value)}
                    placeholder="Proponer una nueva mejora..."
                    style={{
                      flex: 1,
                      backgroundColor: '#1f262a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.84rem',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#00e676',
                      color: '#082e30',
                      border: 'none',
                      padding: '0.65rem 1rem',
                      borderRadius: '12px',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            )}

            {activeInfoModal === 'dotz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>🪶</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Dotz (Plumas) & Logros</h3>
                    <p style={{ color: '#9ba7ac', fontSize: '0.82rem', margin: 0 }}>Recompensas por tu empatía y autocuidado</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ flex: 1, backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.85rem', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>150 🪶</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ba7ac', fontWeight: 700 }}>Plumas Acumuladas</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '0.85rem', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24' }}>3 Días 🔥</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ba7ac', fontWeight: 700 }}>Racha de Bienestar</div>
                  </div>
                </div>

                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9ba7ac' }}>MISIONES PARA GANAR MÁS PLUMAS:</div>
                  <button
                    onClick={() => { setActiveInfoModal(null); navigate('/app/mood'); }}
                    style={{ backgroundColor: '#1f262a', border: '1px solid rgba(255,255,255,0.08)', padding: '0.7rem 0.9rem', borderRadius: '12px', color: '#ffffff', fontSize: '0.84rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <span>+10 🪶 Registrar tu estado de ánimo de hoy</span>
                    <span style={{ color: '#00e676' }}>Ir →</span>
                  </button>
                  <button
                    onClick={() => { setActiveInfoModal(null); navigate('/app/feed'); }}
                    style={{ backgroundColor: '#1f262a', border: '1px solid rgba(255,255,255,0.08)', padding: '0.7rem 0.9rem', borderRadius: '12px', color: '#ffffff', fontSize: '0.84rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <span>+5 🪶 Enviar un abrazo virtual a un compañero</span>
                    <span style={{ color: '#00e676' }}>Ir →</span>
                  </button>
                </div>

                <button
                  onClick={() => { setActiveInfoModal(null); navigate('/app/profile'); }}
                  style={{ width: '100%', backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.85rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0, 230, 118, 0.35)' }}
                >
                  Abrir Tienda de Avatares →
                </button>
              </div>
            )}

            {activeInfoModal === 'seguridad' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>🛡️</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Centro de Seguridad</h3>
                    <p style={{ color: '#9ba7ac', fontSize: '0.82rem', margin: 0 }}>Configura tus preferencias de privacidad y anonimato</p>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '0.75rem 1rem', borderRadius: '14px', color: '#10b981', fontSize: '0.82rem', fontWeight: 800, textAlign: 'left' }}>
                  🔒 100% Anónimo: Tu nombre e identidad real no se vinculan con tus desahogos en la plataforma.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                  {[
                    { key: 'hideCareer', label: 'Ocultar mi carrera en publicaciones públicas' },
                    { key: 'allowDM', label: 'Permitir solicitudes de chat directo de Aliados' },
                    { key: 'hideProfile', label: 'Ocultar mi perfil en búsquedas de estudiantes' }
                  ].map((setting) => (
                    <label
                      key={setting.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        backgroundColor: '#1f262a',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>{setting.label}</span>
                      <input
                        type="checkbox"
                        checked={privacySettings[setting.key]}
                        onChange={(e) => {
                          setPrivacySettings(prev => ({ ...prev, [setting.key]: e.target.checked }));
                          showToast('Preferencias de privacidad actualizadas');
                        }}
                        style={{ width: '18px', height: '18px', accentColor: '#00e676', cursor: 'pointer' }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeInfoModal === 'guia' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>📖</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Guía de la Comunidad</h3>
                    <p style={{ color: '#9ba7ac', fontSize: '0.82rem', margin: 0 }}>Paso {guideStep} de 4 · Aprende a usar Free Mind</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#1f262a', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', minHeight: '130px' }}>
                  {guideStep === 1 && (
                    <>
                      <h4 style={{ color: '#00e676', margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 900 }}>1. Desahógate sin juicios</h4>
                      <p style={{ color: '#9ba7ac', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        Publica lo que sientes con total tranquilidad. Tu seudónimo protege tu privacidad para que puedas hablar sobre estrés, exámenes o emociones libremente.
                      </p>
                    </>
                  )}
                  {guideStep === 2 && (
                    <>
                      <h4 style={{ color: '#38bdf8', margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 900 }}>2. Apoya a tus compañeros</h4>
                      <p style={{ color: '#9ba7ac', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        Haz clic en el botón 💙 de cada publicación para enviar un abrazo virtual. Una sola palabra empática puede cambiar el día de un estudiante.
                      </p>
                    </>
                  )}
                  {guideStep === 3 && (
                    <>
                      <h4 style={{ color: '#fbbf24', margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 900 }}>3. Acumula Plumas & Avatares</h4>
                      <p style={{ color: '#9ba7ac', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        Cada día que registres tu estado de ánimo o ayudes a un par ganarás Plumas para personalizar tu perfil con avatares exclusivos.
                      </p>
                    </>
                  )}
                  {guideStep === 4 && (
                    <>
                      <h4 style={{ color: '#f43f5e', margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 900 }}>4. Botón S.O.S de Emergencia</h4>
                      <p style={{ color: '#9ba7ac', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                        Si tú o alguien necesita apoyo profesional inmediato, el botón S.O.S conecta 24/7 con psicólogos del campus y líneas clínicas gratuitas.
                      </p>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {guideStep > 1 && (
                    <button
                      onClick={() => setGuideStep(guideStep - 1)}
                      style={{ flex: 1, backgroundColor: '#1f262a', color: '#ffffff', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ← Anterior
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (guideStep < 4) {
                        setGuideStep(guideStep + 1);
                      } else {
                        setActiveInfoModal(null);
                        setGuideStep(1);
                      }
                    }}
                    style={{ flex: 1, backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: 900, cursor: 'pointer' }}
                  >
                    {guideStep < 4 ? 'Siguiente Paso →' : 'Comenzar a explorar ✨'}
                  </button>
                </div>
              </div>
            )}

            {activeInfoModal === 'helpline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>📞</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>Líneas de Atención Clínica 24/7</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Atención psicológica gratuita e inmediata</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <a
                    href="tel:113"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f43f5e',
                      color: '#ffffff',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      fontWeight: 900,
                      fontSize: '0.95rem'
                    }}
                  >
                    <span>📞 MINSA 113 Opción 5 (Gratis 24/7)</span>
                    <span>Llamar →</span>
                  </a>

                  <a
                    href="tel:016106400"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--surface-elevated)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    <span>🏥 Central Bienestar Científica del Sur</span>
                    <span>Llamar →</span>
                  </a>
                </div>

                {/* Interactive Breathing Exercise Box */}
                <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.08)', border: '1.5px solid rgba(0, 230, 118, 0.35)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#00e676', marginBottom: '0.4rem' }}>
                    🧘 Ejercicio Guiado de Calma (1 Minuto)
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 700, minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {breathingText}
                  </div>
                  <button
                    onClick={() => setBreathingActive(!breathingActive)}
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: breathingActive ? '#f43f5e' : '#00e676',
                      color: breathingActive ? '#ffffff' : '#082e30',
                      border: 'none',
                      padding: '0.45rem 1.25rem',
                      borderRadius: '9999px',
                      fontWeight: 900,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {breathingActive ? 'Detener Ejercicio' : 'Iniciar Respiración 4-7-8'}
                  </button>
                </div>
              </div>
            )}

            {activeInfoModal === 'acerca' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }} className="animate-fade-in">
                <TalkCampusLogo size={36} showText textColor="var(--text-main)" style={{ justifyContent: 'center', marginBottom: '0.2rem' }} />
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                  Free Mind es la primera plataforma universitaria peruana diseñada para brindar apoyo psicológico anónimo y contención emocional entre pares.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '0.75rem 0.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, color: '#00e676', fontSize: '1.1rem' }}>+5,200</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estudiantes</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '0.75rem 0.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, color: '#38bdf8', fontSize: '1.1rem' }}>+18.5k</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Abrazos</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '0.75rem 0.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontWeight: 900, color: '#fbbf24', fontSize: '1.1rem' }}>100%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Anónimo</div>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveInfoModal(null); setShowShare(true); }}
                  style={{ width: '100%', backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.85rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0, 230, 118, 0.35)' }}
                >
                  Compartir Plataforma con un Compañero 🤝
                </button>
              </div>
            )}

            {activeInfoModal === 'aliado' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>🤝</div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>Programa Hazte un Amigo</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Encuentra o sé un acompañante universitario</p>
                  </div>
                </div>

                <div style={{ display: 'flex', backgroundColor: 'var(--surface-elevated)', borderRadius: '9999px', padding: '0.25rem', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => { setPeerRole('search'); setPeerMatchResult(null); }}
                    style={{ flex: 1, border: 'none', backgroundColor: peerRole === 'search' ? '#00e676' : 'transparent', color: peerRole === 'search' ? '#082e30' : 'var(--text-muted)', fontWeight: 800, padding: '0.5rem', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Busco un Amigo
                  </button>
                  <button
                    onClick={() => { setPeerRole('volunteer'); setPeerMatchResult(null); }}
                    style={{ flex: 1, border: 'none', backgroundColor: peerRole === 'volunteer' ? '#00e676' : 'transparent', color: peerRole === 'volunteer' ? '#082e30' : 'var(--text-muted)', fontWeight: 800, padding: '0.5rem', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Quiero Ser Aliado
                  </button>
                </div>

                {peerRole === 'search' ? (
                  <>
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>SELECCIONA EL TEMA DE CONVERSACIÓN:</label>
                      <select
                        value={peerTopic}
                        onChange={(e) => setPeerTopic(e.target.value)}
                        style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.65rem', color: 'var(--text-main)', fontSize: '0.86rem', outline: 'none' }}
                      >
                        <option value="Exámenes y Estrés">📚 Exámenes y Estrés Académico</option>
                        <option value="Adaptación UCS">🌱 Adaptación al Primer Año UCS</option>
                        <option value="Salud Mental">🧠 Salud Mental y Emociones</option>
                        <option value="Habilidades Sociales">💬 Conversación Tranquila</option>
                      </select>
                    </div>

                    {peerMatchResult ? (
                      <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.12)', border: '1.5px solid #00e676', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="animate-slide-down">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <TalkCampusAvatar id={peerMatchResult.avatar} size={44} />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.95rem' }}>{peerMatchResult.nickname}</div>
                            <div style={{ fontSize: '0.78rem', color: '#00e676', fontWeight: 700 }}>{peerMatchResult.career} · {peerMatchResult.status}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setActiveInfoModal(null); navigate('/app/chat'); }}
                          style={{ backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          Chatear →
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleFindPeerMatch}
                        disabled={peerMatching}
                        style={{ width: '100%', backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.85rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.92rem', cursor: peerMatching ? 'not-allowed' : 'pointer', boxShadow: '0 6px 20px rgba(0, 230, 118, 0.35)' }}
                      >
                        {peerMatching ? 'Buscando coincidencia anónima...' : 'Encontrar Amigo Anónimo ✨'}
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>
                      Recibe capacitación en primera escucha empática del Centro de Bienestar Psicológico UCS y ayuda a tus compañeros.
                    </p>
                    <button
                      onClick={() => {
                        showToast('¡Postulación recibida! Revisa tu correo institucional para los siguientes pasos ✨');
                        setActiveInfoModal(null);
                      }}
                      style={{ width: '100%', backgroundColor: '#00e676', color: '#082e30', border: 'none', padding: '0.85rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer' }}
                    >
                      Inscribirme como Aliado Certificado UCS →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <AIAssistant />
      <GlobalAudioPlayer />
    </div>
  );
}

function SidebarButton({ icon, label, active = false, onClick, accentColor, rightIcon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="sidebar-button-focusable"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0.85rem',
        borderRadius: '16px',
        backgroundColor: active ? 'rgba(0, 230, 118, 0.12)' : 'transparent',
        border: active ? '1.5px solid #00e676' : '1.5px solid transparent',
        color: active ? '#00e676' : (accentColor || 'var(--text-muted)'),
        fontWeight: active ? 800 : 600,
        fontSize: '0.88rem',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.15s ease',
        boxShadow: active ? '0 4px 14px rgba(0, 230, 118, 0.18)' : 'none',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          e.currentTarget.style.color = 'var(--text-main)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = accentColor || 'var(--text-muted)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: active ? '#00e676' : 'inherit' }}>
          {icon}
        </div>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
      </div>
      {rightIcon && <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.7 }}>{rightIcon}</div>}
    </button>
  );
}

