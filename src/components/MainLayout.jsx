import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Bell,
  Sparkles,
  Heart,
  Shield,
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
  Feather,
  ChevronUp,
  Calendar,
  Map,
  Compass,
  Search,
  User,
  Coffee,
  Share2,
  ChevronRight,
  Zap,
  ThumbsUp,
  Lock,
  Award,
  Building,
  ArrowUpRight,
  ArrowRight,
  Check,
  Send,
  Lightbulb,
  Radio,
  Flame
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

  
  const [showShare, setShowShare] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hideBottomNav, setHideBottomNav] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'salas', 'notificaciones', 'mejoras', 'dotz', 'seguridad', 'guia', 'helpline', 'acerca', 'aliado'
  const [expertDropdownOpen, setExpertDropdownOpen] = useState(() => {
    return location.pathname === '/app/expertos' || location.pathname === '/app/citas';
  });

  // ─── SIDEBAR INTERACTIVE MODALS STATE ────────────────────────
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, type: 'hug', title: 'FlyingJay_99 te envió un abrazo', desc: 'En tu publicación de desahogo "Exámenes finales"', time: 'hace 15m', read: false },
    { id: 2, type: 'comment', title: 'Búho_Científica comentó', desc: '"¡No estás solo! Todos apoyamos aquí 💪"', time: 'hace 1h', read: false },
    { id: 3, type: 'reward', title: '+15 Plumas ganadas', desc: 'Por tu registro de estado de ánimo de hoy', time: 'hace 3h', read: false },
    { id: 4, type: 'reminder', title: 'Recordatorio de Cita', desc: 'Psicología Científica del Sur mañana a las 4:00 PM', time: 'hace 5h', read: true }
  ]);

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
        backgroundColor: 'var(--sidebar-bg)',
        padding: '1.15rem 0.85rem 1rem',
        overflowY: 'auto',
        scrollbarWidth: 'none'
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
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
            <LanguageToggle />
          </div>
        </div>

        {/* Navigation Links - Optimized and Grouped */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          
          {/* Tu Progreso */}
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
            {t('student.nav.groupProgress', 'Tu progreso')}
          </div>
          <SidebarButton icon={<Sparkles size={18} color="#a855f7" />} label={t('student.nav.wellnessCenter', 'Centro de Bienestar')} active={currentPath === '/app/mood'} onClick={() => handleNavClick('/app/mood')} />
          <SidebarButton icon={<CircleDot size={18} color="#38bdf8" />} label={t('student.nav.dotz', 'Dotz (Plumas)')} active={currentPath === '/app/dotz'} onClick={() => handleNavClick('/app/dotz')} />

          <div style={{ margin: '0.6rem 0', height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Soporte y Seguridad */}
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>
            {t('student.nav.groupSupport', 'Soporte & Seguridad')}
          </div>
          <SidebarButton icon={<ShieldAlert size={18} color="#f43f5e" />} label={t('student.nav.needHelp', 'Necesito ayuda')} active={currentPath === '/app/sos'} onClick={() => handleNavClick('/app/sos')} accentColor="#f43f5e" />
          <SidebarButton icon={<PhoneCall size={18} color="#f43f5e" />} label={t('student.nav.helpline', 'Línea de ayuda clínica')} active={currentPath === '/app/helpline'} onClick={() => handleNavClick('/app/helpline')} />
          <SidebarButton icon={<ShieldCheck size={18} color="#10b981" />} label={t('student.nav.securityCenter', 'Centro de Seguridad')} active={currentPath === '/app/security'} onClick={() => handleNavClick('/app/security')} />
          <SidebarButton icon={<GraduationCap size={18} />} label={t('student.nav.studentServices', 'Servicios Estudiantiles')} active={currentPath === '/app/expertos' || currentPath === '/app/citas'} onClick={() => handleNavClick('/app/expertos')} />

          <div style={{ margin: '0.6rem 0', height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }} />

          {/* Comunidad y Ajustes */}
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>
            {t('student.nav.groupCommunity', 'Comunidad & Ajustes')}
          </div>
          <SidebarButton icon={<Zap size={18} color="#fbbf24" />} label={t('student.nav.improvements', 'Mejoras')} active={currentPath === '/app/improvements'} onClick={() => handleNavClick('/app/improvements')} />
          <SidebarButton icon={<Compass size={18} />} label={t('student.nav.guide', 'Guía de uso')} active={currentPath === '/app/guide'} onClick={() => handleNavClick('/app/guide')} />
          <SidebarButton icon={<Info size={18} />} label={t('student.nav.about', 'Acerca de Free Mind')} active={currentPath === '/app/about'} onClick={() => handleNavClick('/app/about')} />
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
              <span>{theme === 'light' ? t('student.nav.darkMode', 'Modo Oscuro') : t('student.nav.lightMode', 'Modo Claro')}</span>
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
              title={t('student.nav.share', 'Compartir')}
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
              title={t('student.nav.logout', 'Cerrar sesión')}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEWPORT ───────────────────────────── */}
      <main className="main-content-area" style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Mobile Header (Hidden on desktop) */}
        {currentPath !== '/app/feed' && (
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveInfoModal('notificaciones')}
              style={{
                backgroundColor: 'var(--surface-hover)',
                border: 'none',
                color: 'var(--text-main)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bell size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>
        )}

        {/* Center Routed View (Feed, Chat, Profile, etc.) */}
        <div style={{ flex: 1 }}>
          <Outlet context={{ 
            handleSOS: () => navigate('/app/sos'), 
            showToast, 
            openCompose: () => setShowCompose(true),
            setActiveInfoModal,
            setMobileMenuOpen,
            setHideBottomNav
          }} />
        </div>
      </main>

      {/* ─── MOBILE BOTTOM NAV ──────────────────────────── */}
      {!hideBottomNav && (
        <div className="mobile-bottom-nav">
          <button
            onClick={() => handleNavClick('/app/feed')}
            style={{ background: 'none', border: 'none', color: currentPath === '/app/feed' ? '#00e676' : '#8e9ca0', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}
          >
            <Home size={24} fill={currentPath === '/app/feed' ? '#00e676' : 'none'} />
          </button>
          <button
            onClick={() => handleNavClick('/app/salas')}
            style={{ background: 'none', border: 'none', color: currentPath === '/app/salas' ? '#00e676' : '#8e9ca0', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}
          >
            <DoorOpen size={24} color={currentPath === '/app/salas' ? '#00e676' : '#8e9ca0'} />
          </button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setShowCompose(true)}
              style={{ 
                backgroundColor: '#00e676', 
                color: '#082e30', 
                border: 'none', 
                borderRadius: '50%', 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 230, 118, 0.35)',
                transform: 'translateY(-10px)'
              }}
            >
              <Plus size={26} strokeWidth={3} />
            </button>
          </div>
          <button
            onClick={() => handleNavClick('/app/chat')}
            style={{ background: 'none', border: 'none', color: currentPath === '/app/chat' ? '#00e676' : '#8e9ca0', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}
          >
            <MessageCircle size={24} fill={currentPath === '/app/chat' ? '#00e676' : 'none'} />
          </button>
          <button
            onClick={() => handleNavClick('/app/profile')}
            style={{ background: 'none', border: 'none', color: currentPath === '/app/profile' ? '#00e676' : '#8e9ca0', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}
          >
            <User size={24} fill={currentPath === '/app/profile' ? '#00e676' : 'none'} />
          </button>
        </div>
      )}

      {/* ─── TOAST NOTIFICATIONS ─────────────────────────────── */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-main)',
          padding: '0.65rem 1.25rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }} className="animate-fade-in">
          <span style={{ color: '#00e676', flexShrink: 0 }}>✨</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{toastMessage}</span>
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
      

      {/* 3. Share / Invite a Friend Modal */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* 4. Generic Sidebar Info Modals */}
      {activeInfoModal && (
        <div className="tc-modal-overlay animate-fade-in" onClick={() => setActiveInfoModal(null)}>
          <div className="tc-verification-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveInfoModal(null)}
              aria-label="Cerrar modal"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-hover)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 20
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={18} />
            </button>



            {activeInfoModal === 'notificaciones' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bell size={22} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                      Notificaciones
                    </h3>
                  </div>
                  {notificationsList.length > 0 && (
                    <button
                      onClick={() => {
                        setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
                        showToast('Todas las notificaciones marcadas como leídas');
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 750, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Marcar leídas
                    </button>
                  )}
                </div>

                {notificationsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '2rem 0' }}>
                    No tienes notificaciones pendientes ✨
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
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
                          backgroundColor: item.read ? 'transparent' : 'rgba(16, 185, 129, 0.04)',
                          padding: '0.75rem 0.5rem',
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.read ? 'var(--surface-hover)' : 'rgba(16, 185, 129, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.read ? 'transparent' : 'rgba(16, 185, 129, 0.04)'}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <div style={{
                            marginTop: '2px',
                            color: item.type === 'hug' ? '#3b82f6' :
                                   item.type === 'comment' ? 'var(--primary)' :
                                   item.type === 'reward' ? '#f59e0b' :
                                   item.type === 'reminder' ? '#ef4444' : 'var(--text-muted)'
                          }}>
                            {item.type === 'hug' && <Heart size={16} fill="currentColor" />}
                            {item.type === 'comment' && <MessageCircle size={16} fill="currentColor" />}
                            {item.type === 'reward' && <Feather size={16} />}
                            {item.type === 'reminder' && <Calendar size={16} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: item.read ? 'var(--text-main)' : 'var(--text-main)', marginBottom: '3px' }}>
                              {item.title}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.3 }}>{item.desc}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '5px', opacity: 0.8 }}>{item.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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

