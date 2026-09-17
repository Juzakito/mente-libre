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
import { getRegisteredAccounts } from '../services/accountRegistryService';
import AppleEmoji from './ui/AppleEmoji';

export default function MainLayout() {
  const { user, logout, isAuthLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addPost, posts } = useAppContext();
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
      
      // Use unique users from feed posts
      const uniqueUsers = [];
      const seenNicknames = new Set();
      
      posts.forEach(p => {
        if (!seenNicknames.has(p.author) && p.author !== user?.nickname && p.author !== user?.full_name) {
          seenNicknames.add(p.author);
          uniqueUsers.push({
            nickname: p.author,
            avatar: p.avatar,
            career: p.career || 'Estudiante Universitario'
          });
        }
      });
      
      const allUsers = [...getRegisteredAccounts(), ...uniqueUsers];
      
      // Filter out current user again just in case
      const potentialPeers = allUsers.filter(u => u.nickname && u.nickname !== user?.nickname && u.nickname !== user?.full_name);
      
      let matchedPeer = null;
      if (potentialPeers.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialPeers.length);
        matchedPeer = potentialPeers[randomIndex];
      } else {
        matchedPeer = {
          nickname: 'Anxious_Soul',
          avatar: '👽',
          career: 'Psicología UCS'
        };
      }

      setPeerMatchResult({
        nickname: matchedPeer.nickname,
        avatar: matchedPeer.avatar || '🦊',
        career: matchedPeer.career || 'Estudiante Universitario',
        topic: peerTopic,
        status: 'Disponible ahora'
      });
      showToast(`¡Amigo encontrado! Conectando con ${matchedPeer.nickname} ✨`);
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
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Plus size={18} strokeWidth={2.5} />
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
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }} className="animate-fade-in">
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
                          showToast('Preferencias actualizadas');
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeInfoModal === 'guia' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }} className="animate-fade-in">
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
                        setActiveInfoModal(null);
                        setGuideStep(1);
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
            )}

            {activeInfoModal === 'helpline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', 
                    backgroundColor: 'rgba(244,63,94,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Heart size={22} color="var(--accent-rose)" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Atención Clínica 24/7</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.1rem 0 0', fontWeight: 500 }}>Soporte psicológico inmediato</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href="tel:113"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--accent-rose)',
                      color: '#ffffff',
                      padding: '1rem 1.25rem',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(244,63,94,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,94,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(244,63,94,0.3)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <PhoneCall size={18} strokeWidth={2.5} />
                      <span>MINSA 113 (Opción 5)</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>Gratis</span>
                  </a>

                  <a
                    href="tel:016106400"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      padding: '1rem 1.25rem',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Building size={18} color="var(--text-muted)" />
                      <span>Bienestar Científica del Sur</span>
                    </div>
                    <ArrowUpRight size={16} color="var(--text-muted)" />
                  </a>
                </div>

                {/* Interactive Breathing Exercise Box */}
                <div style={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border-color)', 
                  padding: '1.25rem', 
                  borderRadius: '18px', 
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>
                    <Sparkles size={14} /> Ejercicio de Calma
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-main)', 
                    fontWeight: 700, 
                    minHeight: '24px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    {breathingText}
                  </div>
                  <button
                    onClick={() => setBreathingActive(!breathingActive)}
                    style={{
                      backgroundColor: breathingActive ? 'rgba(244,63,94,0.1)' : 'var(--primary-light)',
                      color: breathingActive ? 'var(--accent-rose)' : 'var(--primary)',
                      border: 'none',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}
                  >
                    {breathingActive ? 'Detener Ejercicio' : 'Iniciar Respiración'}
                  </button>
                </div>
              </div>
            )}

            {activeInfoModal === 'acerca' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <TalkCampusLogo size={32} showText={false} />
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Free Mind</span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, textAlign: 'center', fontWeight: 500 }}>
                  La plataforma universitaria diseñada para brindar apoyo psicológico anónimo y contención emocional entre pares.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>+5.2k</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estudiantes</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>+18k</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Abrazos</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--surface)', padding: '1rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>100%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Anónimo</div>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveInfoModal(null); setShowShare(true); }}
                  style={{ 
                    width: '100%', 
                    backgroundColor: 'var(--text-main)', 
                    color: 'var(--surface)', 
                    border: 'none', 
                    padding: '0.9rem', 
                    borderRadius: '14px', 
                    fontWeight: 800, 
                    fontSize: '0.95rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    marginTop: '0.5rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Compartir Plataforma
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {activeInfoModal === 'aliado' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', textAlign: 'left' }} className="animate-fade-in">

                {/* ── Clean Header ── */}
                <div style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.4rem 1.25rem',
                  marginBottom: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      backgroundColor: 'var(--surface-hover)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                      border: '1px solid var(--border-color)', flexShrink: 0
                    }}><AppleEmoji emoji="🤝" size={32} /></div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Hazte un Amigo</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: 500 }}>Encuentra o sé un acompañante universitario</p>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: 'flex', gap: '0.85rem', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                    {[{ val: '42', label: 'aliados online', icon: '🟢' }, { val: '100%', label: 'anónimo', icon: '🔒' }, { val: '2 min', label: 'tiempo medio', icon: '⚡' }].map((s, i) => (
                      <div key={i} style={{ flex: 1, backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.45rem 0.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', marginBottom: '1px' }}><AppleEmoji emoji={s.icon} size={14} /></div>
                        <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1 }}>{s.val}</div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '1px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Role Toggle ── */}
                <div style={{ display: 'flex', backgroundColor: 'var(--surface-hover)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  {[{ id: 'search', label: '🔍 Busco un Amigo' }, { id: 'volunteer', label: '🌟 Quiero Ser Aliado' }].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setPeerRole(r.id); setPeerMatchResult(null); }}
                      style={{
                        flex: 1, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.78rem',
                        padding: '0.55rem 0.5rem', borderRadius: '9px', transition: 'all 0.2s ease',
                        backgroundColor: peerRole === r.id ? 'var(--primary)' : 'transparent',
                        color: peerRole === r.id ? '#ffffff' : 'var(--text-muted)',
                        boxShadow: peerRole === r.id ? '0 2px 8px rgba(13,148,136,0.35)' : 'none'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* ── SEARCH MODE ── */}
                {peerRole === 'search' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Topic selector with chips */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tema de conversación</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[
                          { value: 'Exámenes y Estrés', label: 'Exámenes', emoji: '📚', color: 'var(--accent-amber)' },
                          { value: 'Adaptación UCS', label: 'Adaptación', emoji: '🌱', color: 'var(--accent-emerald)' },
                          { value: 'Salud Mental', label: 'Salud Mental', emoji: '🧠', color: 'var(--primary)' },
                          { value: 'Habilidades Sociales', label: 'Conversación', emoji: '💬', color: 'var(--accent-blue)' },
                        ].map((t) => (
                          <button
                            key={t.value}
                            onClick={() => setPeerTopic(t.value)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: peerTopic === t.value ? `2px solid ${t.color}` : '1.5px solid var(--border-color)',
                              backgroundColor: peerTopic === t.value ? `color-mix(in srgb, ${t.color} 14%, var(--bg-color))` : 'var(--surface-hover)',
                              color: peerTopic === t.value ? t.color : 'var(--text-muted)',
                              transition: 'all 0.15s ease',
                              boxShadow: peerTopic === t.value ? `0 0 0 3px color-mix(in srgb, ${t.color} 10%, transparent)` : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AppleEmoji emoji={t.emoji} size={14} /> {t.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Match result or find button */}
                    {peerMatchResult ? (
                      <div style={{
                        backgroundColor: 'var(--primary-light)',
                        border: '1.5px solid var(--primary)',
                        padding: '1rem', borderRadius: '16px',
                        display: 'flex', flexDirection: 'column', gap: '0.75rem'
                      }} className="animate-slide-down">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <TalkCampusAvatar id={peerMatchResult.avatar} size={48} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.95rem' }}>{peerMatchResult.nickname}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>{peerMatchResult.career}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                              {peerMatchResult.status}
                            </div>
                          </div>
                          <div style={{ fontSize: '1.4rem' }}><AppleEmoji emoji="✅" size={24} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setPeerMatchResult(null)}
                            style={{ flex: 1, backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.55rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Buscar otro
                          </button>
                          <button
                            onClick={() => { 
                              // Create notification
                              setNotificationsList(prev => [{
                                id: Date.now(),
                                type: 'chat',
                                title: `💬 Nuevo mensaje de ${peerMatchResult.nickname}`,
                                desc: `¡Hola! Vi que también quieres hablar sobre ${peerMatchResult.topic}`,
                                time: 'Justo ahora',
                                read: false
                              }, ...prev]);
                              
                              // Route to chat with peer state
                              setActiveInfoModal(null); 
                              navigate('/app/chat', { 
                                state: { peerMatch: peerMatchResult } 
                              }); 
                            }}
                            style={{ flex: 2, backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none', padding: '0.55rem', borderRadius: '10px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', boxShadow: 'none' }}
                          >
                            Chatear ahora →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleFindPeerMatch}
                        disabled={peerMatching}
                        style={{
                          width: '100%',
                          backgroundColor: peerMatching ? 'var(--surface-hover)' : 'var(--primary)',
                          color: peerMatching ? 'var(--text-muted)' : '#ffffff',
                          border: 'none', padding: '0.9rem', borderRadius: '12px',
                          fontWeight: 900, fontSize: '0.92rem',
                          cursor: peerMatching ? 'not-allowed' : 'pointer',
                          boxShadow: 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
                        }}
                      >
                        {peerMatching ? (
                          <>
                            <span style={{ width: '14px', height: '14px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                            Buscando coincidencia anónima...
                          </>
                        ) : (
                          <>✨ Encontrar Amigo Anónimo</>
                        )}
                      </button>
                    )}

                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                      🔒 Tu identidad permanece anónima en todo momento
                    </p>
                  </div>

                ) : (
                  /* ── VOLUNTEER MODE ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { icon: '🎓', title: 'Capacitación oficial', desc: 'Centro de Bienestar Psicológico UCS' },
                        { icon: '🏅', title: 'Certificado Aliado UCS', desc: 'Reconocimiento académico y horas extracurriculares' },
                        { icon: '💙', title: 'Impacto real', desc: 'Acompaña a compañeros que necesitan apoyo' },
                      ].map((b, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                          backgroundColor: 'var(--surface-hover)',
                          border: '1px solid var(--border-color)',
                          padding: '0.7rem 0.85rem', borderRadius: '12px'
                        }}>
                          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{b.icon}</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>{b.title}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{b.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        showToast('¡Postulación recibida! Revisa tu correo institucional para los siguientes pasos ✨');
                        setActiveInfoModal(null);
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #0d9488 100%)',
                        color: '#ffffff', border: 'none', padding: '0.9rem', borderRadius: '12px',
                        fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(124,58,237,0.3)'
                      }}
                    >
                      🌟 Inscribirme como Aliado Certificado UCS
                    </button>

                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                      Proceso completamente voluntario · Modalidad virtual
                    </p>
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
        borderRadius: 'var(--radius-xl)',
        backgroundColor: active ? 'var(--active-nav-bg)' : 'transparent',
        border: active ? '1px solid var(--active-nav-border)' : '1px solid transparent',
        color: active ? 'var(--active-nav-text)' : (accentColor || 'var(--text-muted)'),
        fontWeight: active ? 700 : 500,
        fontSize: '0.88rem',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all var(--transition-fast)',
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
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: active ? 'var(--active-nav-text)' : 'inherit' }}>
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

