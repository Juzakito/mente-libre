import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, User, ShieldAlert, Moon, Sun, Coffee, BookHeart, Menu, X, Download, Map, Calendar, ChevronDown, ChevronRight, Share2 } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { useTranslation } from 'react-i18next';
import SOSModal from './SOSModal';
import ShareModal from './ShareModal';
import AIAssistant from './AIAssistant';
import LanguageToggle from './ui/LanguageToggle';
import { trackEvent } from '../utils/tracker';
import GlobalAudioPlayer from './audio/GlobalAudioPlayer';
import AppleEmoji from './ui/AppleEmoji';

export default function MainLayout() {
  const { user, isAuthLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showSOS, setShowSOS] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [expertsMenuExpanded, setExpertsMenuExpanded] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
    }

    // Check if iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (isIOSDevice && !window.navigator.standalone) {
      setIsIOS(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }
    } else if (isIOS) {
      showToast(t('student.nav.iosInstall'));
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/landing', { replace: true });
    } else if (!user.nickname) {
      navigate('/onboarding', { replace: true });
    }
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('sos') === 'true') setShowSOS(true);
  }, [user, isAuthLoading, navigate, location]);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAuthLoading && !user) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
        <div style={{ fontSize: '3rem', animation: 'pulse-soft 1.5s infinite' }}>🦉</div>
      </div>
    );
  }

  if (!user) return null;

  const currentPath = location.pathname;
  // Chat page needs special full-height treatment
  const isChat = currentPath === '/app/chat';

  const handleSOS = () => {
    trackEvent('SOS_TRIGGERED', { career: user?.career, context: 'main_layout' });
    setShowSOS(true);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container animate-fade-in">

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar (Desktop sticky + Mobile sliding drawer) */}
      <aside className={`desktop-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{
        display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem 1.5rem',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border-color)',
        overflowY: 'auto',
      }}>
        {/* Drawer close button (mobile only) */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="drawer-close-btn"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)',
            borderRadius: '50%', width: '2.25rem', height: '2.25rem',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem', marginTop: '0.5rem' }}>
          <div style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Free Mind Logo" style={{ height: '48px', width: '48px', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--text-main)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>Free Mind</h1>
            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', boxShadow: '0 0 8px var(--accent-emerald)', display: 'inline-block' }}></span>
              {t('student.nav.connected')}
            </p>
          </div>
        </div>

        <div style={{ padding: '0 0.5rem' }}>
          <LanguageToggle />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <SidebarItem icon={<Home />} label={t('student.nav.community')} path="/app/feed" currentPath={currentPath} onClick={() => handleNavClick('/app/feed')} />
          <SidebarItem icon={<Search />} label={t('student.nav.explore')} path="/app/explore" currentPath={currentPath} onClick={() => handleNavClick('/app/explore')} />
          <SidebarItem 
            icon={<Map />} 
            label={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {t('student.nav.experts')}
                {expertsMenuExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            } 
            path="/app/expertos" 
            currentPath={currentPath} 
            onClick={() => {
              handleNavClick('/app/expertos');
              setExpertsMenuExpanded(!expertsMenuExpanded);
            }} 
          />
          {/* Sub item for Mis Citas */}
          {expertsMenuExpanded && (
            <div className="animate-accordion-down" style={{ paddingLeft: '1.5rem', transformOrigin: 'top' }}>
              <SidebarItem icon={<Calendar size={18} />} label={t('student.nav.myAppointments')} path="/app/citas" currentPath={currentPath} onClick={() => handleNavClick('/app/citas')} />
            </div>
          )}
          <SidebarItem icon={<MessageCircle />} label={t('student.nav.chat')} path="/app/chat" currentPath={currentPath} onClick={() => handleNavClick('/app/chat')} />
          <SidebarItem icon={<BookHeart />} label={t('student.nav.mood')} path="/app/mood" currentPath={currentPath} onClick={() => handleNavClick('/app/mood')} />
          <SidebarItem icon={<User />} label={t('student.nav.profile')} path="/app/profile" currentPath={currentPath} onClick={() => handleNavClick('/app/profile')} />
          <div style={{ margin: '0.75rem 0', height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }}></div>
          <SidebarItem icon={<Coffee />} label={t('student.nav.support')} path="/app/donate" currentPath={currentPath} onClick={() => handleNavClick('/app/donate')} isAction />
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={toggleTheme}
              style={{ flex: 1, backgroundColor: 'color-mix(in srgb, var(--surface) 50%, transparent)', color: 'var(--text-main)', padding: '0.85rem', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 800, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', backdropFilter: 'blur(8px)' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'light' ? t('student.nav.darkMode') : t('student.nav.lightMode')}
            </button>
            <button
              onClick={() => { setShowShare(true); setMobileMenuOpen(false); }}
              style={{ width: '3.25rem', backgroundColor: 'color-mix(in srgb, var(--surface) 50%, transparent)', color: 'var(--text-main)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', backdropFilter: 'blur(8px)' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              title={t('student.nav.shareApp')}
            >
              <Share2 size={18} />
            </button>
          </div>

          <button
            onClick={handleSOS}
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              color: 'white',
              padding: '0.85rem',
              borderRadius: '16px',
              fontSize: '0.875rem',
              fontWeight: 900,
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.45)',
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              letterSpacing: '0.02em',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(244, 63, 94, 0.6)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(244, 63, 94, 0.45)'; }}
          >
            <ShieldAlert size={18} /> {t('student.nav.sos')}
          </button>

          {(!isStandalone && (deferredPrompt || isIOS)) && (
            <button
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, black) 100%)',
                color: 'white',
                padding: '0.85rem',
                borderRadius: '16px',
                fontSize: '0.875rem',
                fontWeight: 900,
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px color-mix(in srgb, var(--primary) 40%, transparent)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                letterSpacing: '0.02em',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
              <Download size={18} /> {t('student.nav.installApp')}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content-area no-scrollbar ${isChat ? 'chat-layout' : ''}`}>
        <div className={`content-wrapper ${isChat ? 'chat-content' : ''}`}>

          {/* Mobile Header — hidden on desktop via CSS */}
          <header className="mobile-header glass" style={{ padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '12px', width: '2.25rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}
              >
                <Menu size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: theme === 'dark' ? 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))' }}>
                <img src="/logo.png" alt="Free Mind Logo" style={{ height: '34px', width: '34px', objectFit: 'contain' }} />
              </div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Free Mind</h1>
                <p style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', boxShadow: '0 0 5px var(--accent-emerald)', display: 'inline-block' }}></span>
                  {t('student.nav.connected')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <LanguageToggle />
              <button
                onClick={toggleTheme}
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)', width: '2.25rem', height: '2.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', flexShrink: 0 }}
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </button>
              <button
                onClick={handleSOS}
                className="sos-pulse-btn"
                style={{ backgroundColor: '#f43f5e', color: 'white', paddingLeft: '1rem', paddingRight: '1rem', height: '2.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 900, border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)' }}
              >
                <ShieldAlert size={16} fill="currentColor" /> S.O.S
              </button>
            </div>
          </header>

          <Outlet context={{ handleSOS, showToast }} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <NavItem icon={<Home />} label={t('student.nav.community')} path="/app/feed" currentPath={currentPath} onClick={() => navigate('/app/feed')} />
        <NavItem icon={<Map />} label={t('student.nav.expertsMobile')} path="/app/expertos" currentPath={currentPath} onClick={() => navigate('/app/expertos')} />
        <NavItem icon={<BookHeart />} label={t('student.nav.mood')} path="/app/mood" currentPath={currentPath} onClick={() => navigate('/app/mood')} />
        <NavItem icon={<MessageCircle />} label={t('student.nav.chat')} path="/app/chat" currentPath={currentPath} onClick={() => navigate('/app/chat')} />
        <NavItem icon={<User />} label={t('student.nav.profile')} path="/app/profile" currentPath={currentPath} onClick={() => navigate('/app/profile')} />
      </nav>

      {toastMessage && (
        <div className="toast">
          <span style={{ fontSize: '1.25rem' }}>✨</span> {toastMessage}
        </div>
      )}

      {showSOS && <SOSModal reason="manual" onClose={() => setShowSOS(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
      <AIAssistant />
      <GlobalAudioPlayer />
    </div>
  );
}

function SidebarItem({ icon, label, path, currentPath, onClick, isAction }) {
  const active = currentPath === path;

  if (isAction) {
    return (
      <button
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          color: active ? 'white' : 'var(--primary)',
          padding: '0.875rem 1.25rem', borderRadius: '16px',
          background: active ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          cursor: 'pointer', fontWeight: 800, fontSize: '0.95rem',
          width: '100%', textAlign: 'left',
        }}
        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 20%, transparent)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 10%, transparent)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
      >
        {React.cloneElement(icon, { size: 20 })}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        padding: '0.875rem 1.25rem', borderRadius: '16px',
        background: active ? 'linear-gradient(90deg, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 100%)' : 'transparent',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'pointer', fontWeight: active ? 900 : 600, fontSize: '0.95rem',
        borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent',
        width: '100%', textAlign: 'left',
      }}
      onMouseEnter={(e) => { 
        if (!active) { 
          e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 10%, transparent)'; 
          e.currentTarget.style.color = 'var(--text-main)';
          e.currentTarget.style.transform = 'translateX(4px)'; 
        } 
      }}
      onMouseLeave={(e) => { 
        if (!active) { 
          e.currentTarget.style.background = 'transparent'; 
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.transform = 'translateX(0)'; 
        } 
      }}
    >
      <div style={{
        color: active ? 'var(--primary)' : 'var(--text-muted)',
        filter: active ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--primary) 50%, transparent))' : 'none',
        transition: 'all 0.2s ease',
      }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span>{label}</span>
    </button>
  );
}

function NavItem({ icon, label, path, currentPath, onClick }) {
  const active = currentPath === path;
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', color: active ? 'var(--primary)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.25rem', flex: 1 }}>
      <div style={{ padding: '0.35rem 0.6rem', borderRadius: '12px', backgroundColor: active ? 'var(--primary-light)' : 'transparent', color: active ? 'var(--primary)' : 'inherit', transition: 'all 0.2s ease' }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span style={{ fontSize: '0.65rem', fontWeight: active ? 800 : 600, letterSpacing: '0.01em' }}>{label}</span>
    </button>
  );
}
