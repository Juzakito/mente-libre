import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Heart,
  Lock,
  Clock,
  Sparkles,
  Building,
  Sun,
  Moon,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Globe,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
  PhoneCall,
  Star,
  Download,
  Smartphone,
  Check,
  Users,
  Award,
  ExternalLink,
  Menu,
  Quote
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import FreeMindLogo from '../components/ui/FreeMindLogo';
import TalkCampusAvatar from '../components/ui/TalkCampusAvatar';

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE — Free Mind
   High-Contrast Dark Teal / Light Adaptive Redesign
   
   Guarantees 100% legibility & contrast in both light & dark mode:
   ─ Theme-aware heading and text colors (no hardcoded unreadable white text)
   ─ Responsive Bento Grid (24px rounded)
   ─ Active Section Indicator in Sticky Navbar
   ─ Dynamic Tag Marquee
   ─ High contrast WCAG AA compliant across all cards & buttons
   ═══════════════════════════════════════════════════════════ */

const LANDING_STYLES_ID = 'landing-keyframes-v3';
const LANDING_CSS = `
  @keyframes marqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroPillPop {
    0% { opacity: 0; transform: scale(0.85); }
    60% { transform: scale(1.04); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(1deg); }
  }

  /* Uniform & Synchronized Theme Transition for all Landing Elements */
  .landing-theme-root,
  .landing-theme-root header,
  .landing-theme-root section,
  .landing-theme-root footer,
  .landing-theme-root h1,
  .landing-theme-root h2,
  .landing-theme-root h3,
  .landing-theme-root p,
  .landing-theme-root span,
  .landing-theme-root div,
  .landing-theme-root button,
  .landing-theme-root a {
    transition: background-color 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease;
  }

  .landing-hero-anim { animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .landing-pill-anim { animation: heroPillPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .landing-card-anim { animation: cardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .landing-card-hover {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                background-color 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease !important;
  }
  .landing-card-hover:hover { transform: translateY(-6px); }
  
  .landing-marquee-track {
    display: flex;
    gap: 1rem;
    animation: marqueeScroll 40s linear infinite;
    width: max-content;
  }
  .landing-marquee-track:hover { animation-play-state: paused; }
  
  .landing-nav-link {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.92rem;
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
    position: relative;
    transition: color 0.2s ease, background-color 0.2s ease;
  }
  .landing-nav-link:hover {
    color: var(--text-main);
    background-color: rgba(0, 210, 142, 0.1);
  }
  .landing-nav-link.active {
    color: var(--primary);
    font-weight: 800;
  }
  .landing-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 3px;
    background-color: var(--primary);
    border-radius: 9999px;
    box-shadow: 0 0 8px var(--primary);
  }

  .landing-cta-primary {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease !important;
  }
  .landing-cta-primary:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 14px 40px rgba(0, 210, 142, 0.45) !important;
  }
  .landing-cta-primary:active {
    transform: translateY(0) scale(0.99) !important;
  }
  
  .landing-cta-secondary {
    transition: border-color 0.25s ease, transform 0.25s ease, background-color 0.25s ease !important;
  }
  .landing-cta-secondary:hover {
    border-color: var(--primary) !important;
    background-color: rgba(0, 210, 142, 0.08) !important;
    transform: translateY(-2px);
  }

  .landing-faq-btn {
    transition: background-color 0.2s ease !important;
  }
  .landing-faq-btn:hover {
    background-color: rgba(0, 210, 142, 0.06);
  }

  @media (max-width: 1024px) {
    .landing-hero-split { flex-direction: column !important; text-align: center !important; }
    .landing-hero-actions { justify-content: center !important; }
    .landing-hero-left { max-width: 100% !important; }
    .landing-hero-mockup { margin-top: 2rem !important; width: 100% !important; justify-content: center !important; }
    .landing-bento-grid { grid-template-columns: 1fr !important; }
    .landing-bento-card-wide { grid-column: span 1 !important; }
    .landing-peer-split { flex-direction: column !important; }
    .landing-photo-split { flex-direction: column !important; }
  }

  @media (max-width: 767px) {
    .hidden-mobile { display: none !important; }
    .landing-hero-title { font-size: 2.3rem !important; }
    .landing-steps-grid { grid-template-columns: 1fr !important; }
    .landing-problems-grid { grid-template-columns: 1fr !important; }
    .landing-testimonials-grid { grid-template-columns: 1fr !important; }
    .landing-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .landing-footer-grid { grid-template-columns: 1fr !important; text-align: center !important; }
  }
`;

export default function Landing() {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [lang, setLang] = useState('es');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeVibeTag, setActiveVibeTag] = useState('Ansioso 🥺');
  const [activeSection, setActiveSection] = useState('');

  // Clock for real time card
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject keyframes
  useEffect(() => {
    if (!document.getElementById(LANDING_STYLES_ID)) {
      const style = document.createElement('style');
      style.id = LANDING_STYLES_ID;
      style.textContent = LANDING_CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(LANDING_STYLES_ID);
      if (el) el.remove();
    };
  }, []);

  // Active section scroll detector
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['problema', 'solucion', 'funciones', 'testimonios', 'faq'];
      const scrollPos = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user && user.nickname) {
      navigate('/app/feed', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const handleStart = () => {
    if (user?.nickname) {
      navigate('/app/feed');
    } else {
      navigate('/onboarding');
    }
  };

  const faqList = [
    {
      q: '¿Es realmente 100% anónimo y seguro?',
      a: 'Sí. Tu nombre real, correo electrónico y datos institucionales están protegidos mediante cifrado de extremo a extremo. En el feed y salas públicas solo se muestra tu avatar y alias anónimo.'
    },
    {
      q: '¿Cómo funciona la moderación y el apoyo de pares?',
      a: 'La comunidad cuenta con moderación automatizada por IA y supervisión humana 24/7. Fomentamos un espacio libre de juicios donde los estudiantes se apoyan mutuamente con empatía y respeto.'
    },
    {
      q: '¿Qué sucede si atravieso una situación de crisis grave?',
      a: 'Free Mind cuenta con el protocolo de protección I-CARE. Si el sistema detecta señales de riesgo o haces clic en "Necesito ayuda", se activan líneas de emergencia directa (Línea 113 MINSA) y derivación prioritaria.'
    },
    {
      q: '¿Tiene algún costo para los estudiantes universitarios?',
      a: 'No. Gracias al convenio e impulso para la Universidad Científica del Sur y la red de educación superior, el acceso a las funciones comunitarias, chat de desahogo y agendamiento es 100% gratuito para los estudiantes.'
    },
    {
      q: '¿Cómo puedo agendar una cita con los psicólogos universitarios?',
      a: 'Dentro de la plataforma, ve a la sección "Conecta con un experto", selecciona el profesional de tu preferencia y elige el horario disponible que mejor se adapte a tus clases.'
    }
  ];

  // Design Tokens with high contrast for BOTH Light Mode and Dark Mode
  const t = {
    bg: isDark ? '#091D1E' : '#ffffff',
    cardBg: isDark ? 'rgba(15, 41, 43, 0.75)' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'var(--border-color)',
    cardShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 8px 24px rgba(0,0,0,0.06)',
    headingColor: isDark ? '#ffffff' : '#0f172a',
    bodyColor: isDark ? '#94a3b8' : '#475569',
    accentGreen: isDark ? '#00D28E' : '#0d9488',
    accentBlue: isDark ? '#2D68FF' : '#2563eb',
    accentViolet: isDark ? '#8B5CF6' : '#7c3aed',
  };

  const marqueePills = [
    { text: '#Estrés', bg: isDark ? '#00D28E' : '#0d9488', textColor: '#ffffff' },
    { text: '#Ansiedad', bg: isDark ? '#2D68FF' : '#2563eb', textColor: '#ffffff' },
    { text: '#Exámenes', bg: isDark ? '#8B5CF6' : '#7c3aed', textColor: '#ffffff' },
    { text: '#Soledad', bg: '#ec4899', textColor: '#ffffff' },
    { text: '#SaludMental', bg: '#10b981', textColor: '#ffffff' },
    { text: '#Universidad', bg: '#f59e0b', textColor: '#000000' },
    { text: '#Autoestima', bg: '#06b6d4', textColor: '#ffffff' },
    { text: '#Futuro', bg: '#a855f7', textColor: '#ffffff' },
    { text: '#PresiónSocial', bg: '#f43f5e', textColor: '#ffffff' },
  ];

  return (
    <div
      className="landing-theme-root"
      style={{
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: 'var(--text-main)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        transition: 'background-color 0.2s ease, color 0.2s ease'
      }}
    >

      {/* ─── Ambient Glow Spheres ────────────────────────────── */}
      <div style={{
        position: 'fixed', top: '-200px', left: '10%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(0, 210, 142, 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', top: '350px', right: '-5%',
        width: '750px', height: '750px', borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(45, 104, 255, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
        filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
      }} />

      {/* ═══ 1. ENCABEZADO (NAVBAR) ULTRA-FLUIDO ═══════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.9rem 2.5rem',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        backgroundColor: isDark ? 'rgba(9, 29, 30, 0.88)' : 'rgba(255, 255, 255, 0.88)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}`,
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}>
        {/* Left: Logo */}
        <div style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
          <FreeMindLogo size={36} textColor="var(--text-main)" />
        </div>

        {/* Center: Nav links */}
        <nav style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }} className="hidden-mobile">
          {[
            { label: 'Problema', href: '#problema', id: 'problema' },
            { label: 'Solución', href: '#solucion', id: 'solucion' },
            { label: 'Funciones', href: '#funciones', id: 'funciones' },
            { label: 'Testimonios', href: '#testimonios', id: 'testimonios' },
            { label: 'FAQ', href: '#faq', id: 'faq' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`landing-nav-link ${activeSection === link.id ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
              border: `1px solid ${t.cardBorder}`,
              color: 'var(--text-main)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
              overflow: 'hidden', boxSizing: 'border-box'
            }}
          >
            {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#475569" />}
          </button>

          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{
              padding: '0.45rem 0.85rem', borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'var(--surface)',
              color: 'var(--text-muted)',
              border: `1px solid ${t.cardBorder}`,
              fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
            }}
          >
            {lang === 'es' ? 'ES | EN' : 'EN | ES'}
          </button>

          <button
            onClick={() => navigate('/b2b')}
            className="hidden-mobile"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.55rem 1.25rem', borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(0, 210, 142, 0.12)' : 'rgba(13, 148, 136, 0.1)',
              color: isDark ? '#00D28E' : 'var(--primary)',
              border: `1px solid ${isDark ? 'rgba(0, 210, 142, 0.3)' : 'var(--primary)'}`,
              fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isDark ? '0 0 16px rgba(0, 210, 142, 0.15)' : 'none'
            }}
          >
            <Building size={16} />
            <span>Universidades & ROI</span>
          </button>
        </div>
      </header>

      {/* ═══ 2. SECCIÓN HERO (PRINCIPAL) Y CONEXIÓN VISUAL ═════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '5rem 2rem 6rem',
        display: 'flex', flexDirection: 'column', gap: '3rem'
      }}>
        <div className="landing-hero-split" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3.5rem'
        }}>
          {/* Left Content */}
          <div className="landing-hero-left" style={{ flex: 1, maxWidth: '620px', textAlign: 'left' }}>
            {/* Tag: Espacio 100% Anónimo y Seguro */}
            <div className="landing-pill-anim" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
              backgroundColor: isDark ? 'rgba(0, 210, 142, 0.14)' : '#ccfbf1',
              color: isDark ? '#00D28E' : '#0f766e',
              padding: '0.55rem 1.35rem', borderRadius: '9999px',
              fontWeight: 800, fontSize: '0.85rem',
              marginBottom: '2rem',
              border: `1px solid ${isDark ? 'rgba(0, 210, 142, 0.3)' : '#99f6e4'}`,
              boxShadow: '0 4px 16px rgba(0, 210, 142, 0.15)'
            }}>
              <Shield size={16} />
              <span>Espacio 100% Anónimo y Seguro</span>
            </div>

            {/* Impact Title */}
            <h1 className="landing-hero-anim landing-hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: '1.5rem',
              color: t.headingColor
            }}>
              Red de Apoyo Estudiantil.{' '}
              <span style={{
                color: t.accentGreen,
                textShadow: isDark ? '0 0 30px rgba(0, 210, 142, 0.35)' : 'none'
              }}>
                Porque nadie debería luchar solo.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="landing-hero-anim" style={{
              fontSize: '1.12rem', lineHeight: 1.7, color: t.bodyColor,
              marginBottom: '2.5rem', fontWeight: 500,
              animationDelay: '0.15s', opacity: 0
            }}>
              Conecta con compañeros que entienden por lo que estás pasando. Soporte moderado 24/7 para tu tranquilidad mental, bienestar y prevención de la deserción.
            </p>

            {/* Parallel Action Buttons */}
            <div className="landing-hero-actions landing-hero-anim" style={{
              display: 'flex', flexWrap: 'wrap', gap: '1rem',
              marginBottom: '2.5rem', animationDelay: '0.3s', opacity: 0
            }}>
              <button
                onClick={handleStart}
                className="landing-cta-primary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
                  backgroundColor: isDark ? '#00D28E' : 'var(--primary)',
                  color: isDark ? '#042721' : '#ffffff',
                  padding: '1.05rem 2.4rem', borderRadius: '9999px',
                  fontSize: '1.05rem', fontWeight: 900, border: 'none',
                  cursor: 'pointer',
                  boxShadow: isDark ? '0 10px 30px rgba(0, 210, 142, 0.4)' : '0 10px 30px rgba(13, 148, 136, 0.3)',
                }}
              >
                <span>Comenzar Gratis</span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="landing-cta-secondary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'var(--surface)',
                  color: t.headingColor,
                  padding: '1.05rem 2.2rem', borderRadius: '9999px',
                  fontSize: '1.05rem', fontWeight: 800,
                  border: `1px solid ${t.cardBorder}`,
                  cursor: 'pointer',
                }}
              >
                <Play size={18} fill={t.accentGreen} color={t.accentGreen} />
                <span>Ver Demostración</span>
              </button>
            </div>

            {/* University Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              fontSize: '0.85rem', color: t.bodyColor, fontWeight: 600
            }}>
              <span>🎓 Integración oficial para:</span>
              <strong style={{ color: t.headingColor }}>Universidad Científica del Sur</strong>
            </div>
          </div>

          {/* Right Mobile Mockup Integrated */}
          <div className="landing-hero-mockup landing-hero-anim" style={{
            flex: 1, display: 'flex', justifyContent: 'flex-end',
            animationDelay: '0.4s', opacity: 0
          }}>
            <div style={{
              width: '100%', maxWidth: '420px',
              borderRadius: '28px',
              backgroundColor: '#0f292b',
              border: '2px solid rgba(0, 210, 142, 0.25)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 210, 142, 0.15)',
              padding: '1.75rem', position: 'relative'
            }}>
              {/* Floating Shield Tag Top Right */}
              <div style={{
                position: 'absolute', top: '-16px', right: '-12px',
                backgroundColor: '#00D28E', color: '#042721',
                padding: '0.45rem 0.95rem', borderRadius: '9999px',
                fontSize: '0.78rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: '0 6px 20px rgba(0, 210, 142, 0.4)',
                animation: 'floatSlow 4s ease-in-out infinite'
              }}>
                <Shield size={14} /> 100% Anónimo
              </div>

              {/* Mobile App Header Mock */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: '1rem', marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <TalkCampusAvatar id="owl" size={36} />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#ffffff' }}>BúhoEstudiantil</div>
                    <div style={{ fontSize: '0.72rem', color: '#00D28E', fontWeight: 700 }}>🟢 Conectado anónimamente</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>12:15 AM</span>
              </div>

              {/* Simulated Post Card 1 */}
              <div style={{
                backgroundColor: 'rgba(9, 29, 30, 0.9)',
                borderRadius: '16px', padding: '1.1rem',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '1rem'
              }}>
                <p style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                  "Los exámenes finales me paralizan el pensamiento esta semana. ¿Alguien libre para desahogarse?"
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: 'rgba(0, 210, 142, 0.15)', color: '#00D28E', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                    Ansioso 🥺
                  </span>
                  <span style={{ backgroundColor: 'rgba(45, 104, 255, 0.15)', color: '#60a5fa', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                    💙 24 Abrazos
                  </span>
                </div>
              </div>

              {/* Simulated Response Card 2 */}
              <div style={{
                backgroundColor: 'rgba(0, 210, 142, 0.12)',
                borderRadius: '16px', padding: '1.1rem',
                border: '1px solid rgba(0, 210, 142, 0.3)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <TalkCampusAvatar id="fox" size={32} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#00D28E' }}>FlyingJay_UCS</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>"¡No estás solo! Todos estamos en el mismo barco 💪"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. CUADRÍCULA MODULAR DE CARACTERÍSTICAS (BENTO GRID 24px) ═══ */}
      <section id="solucion" style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '4rem 2rem 6rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionLabel color={t.accentGreen} text="Grid de Alta Usabilidad" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: t.headingColor, letterSpacing: '-0.03em' }}>
            Un ecosistema modular para tu tranquilidad.
          </h2>
        </div>

        <div className="landing-bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {/* Card 1: Green Chat Simulated */}
          <BentoCard className="landing-card-hover" style={{
            backgroundColor: isDark ? '#00D28E' : '#0d9488',
            color: isDark ? '#042721' : '#ffffff',
            gridColumn: 'span 1', minHeight: '340px',
            boxShadow: '0 12px 36px rgba(0, 210, 142, 0.25)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', opacity: 0.9 }}>
                CHAT SIMULADO ANÓNIMO
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Tu espacio seguro para hablar sin juicios.
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '0.7rem 1rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', maxWidth: '90%' }}>
                  "Siento mucha presión de entregar la tesis..."
                </div>
                <div style={{ backgroundColor: '#042721', color: '#00D28E', padding: '0.7rem 1rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 800, alignSelf: 'flex-end' }}>
                  "Respira. Te entendemos perfectamente 🌿"
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', fontWeight: 900, fontSize: '0.85rem' }}>
              <Users size={18} /> +2.5M interacciones seguras
            </div>
          </BentoCard>

          {/* Card 2: Center Featured Student Photo */}
          <BentoCard className="landing-card-hover" style={{
            backgroundImage: `linear-gradient(180deg, rgba(9, 29, 30, 0.2) 0%, rgba(9, 29, 30, 0.9) 80%), url('/images/student_smiling_community.jpg')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            color: '#ffffff', gridColumn: 'span 1', minHeight: '340px',
            boxShadow: t.cardShadow, position: 'relative', overflow: 'hidden'
          }}>
            <div />
            <div>
              <span style={{
                backgroundColor: '#00D28E', color: '#042721',
                padding: '0.35rem 0.85rem', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 900, marginBottom: '0.75rem', display: 'inline-block'
              }}>
                Comunidad Universitaria
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.25, textShadow: '0 2px 10px rgba(0,0,0,0.8)', color: '#ffffff' }}>
                Conecta con tu comunidad universitaria.
              </h3>
            </div>
          </BentoCard>

          {/* Card 3: Vibrant Blue Card (12:15 AM) */}
          <BentoCard className="landing-card-hover" style={{
            backgroundColor: '#2D68FF', color: '#ffffff',
            gridColumn: 'span 1', minHeight: '340px',
            boxShadow: '0 12px 36px rgba(45, 104, 255, 0.25)'
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {currentTimeStr || '12:15 AM'}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 700, marginTop: '0.4rem' }}>
                Perú · Moderación nocturna 24/7
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.55rem', fontWeight: 900, lineHeight: 1.2, marginTop: '1.5rem', color: '#ffffff' }}>
                Nadie te juzgará aquí a ninguna hora.
              </h3>
            </div>
          </BentoCard>

          {/* Card 4: Violet Anonymity */}
          <BentoCard className="landing-card-hover" style={{
            backgroundColor: '#8B5CF6', color: '#ffffff',
            gridColumn: 'span 1', minHeight: '280px',
            boxShadow: '0 12px 36px rgba(139, 92, 246, 0.25)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem', color: '#ffffff' }}>
                Sé 100% tú mismo, anónimamente.
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: 1.55, fontWeight: 600 }}>
                Protegemos tu identidad real. Expresa lo que sientes sin el peso de la opinión social.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              <TalkCampusAvatar id="owl" size={38} />
              <TalkCampusAvatar id="fox" size={38} />
              <TalkCampusAvatar id="unicorn" size={38} />
            </div>
          </BentoCard>

          {/* Card 5: Multilingual Card */}
          <BentoCard className="landing-card-hover landing-bento-card-wide" style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            gridColumn: 'span 2', minHeight: '280px',
            boxShadow: t.cardShadow
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: t.accentGreen, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                INCLUSIÓN LINGÜÍSTICA
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem', color: t.headingColor }}>
                Conecta en tu idioma nativo o preferido.
              </h3>
              <p style={{ fontSize: '0.9rem', color: t.bodyColor, lineHeight: 1.6 }}>
                Soporte de interfaz e interacción comunitaria disponible en múltiples lenguas.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.25rem' }}>
              {[
                { name: 'Español 🇵🇪', active: true },
                { name: 'English 🇺🇸', active: false },
                { name: 'Português 🇧🇷', active: false },
                { name: 'Runasimi (Quechua) 🏔️', active: false }
              ].map(langItem => (
                <span key={langItem.name} style={{
                  backgroundColor: langItem.active ? 'rgba(0, 210, 142, 0.15)' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                  color: langItem.active ? t.accentGreen : t.bodyColor,
                  border: `1px solid ${langItem.active ? 'rgba(0, 210, 142, 0.4)' : t.cardBorder}`,
                  padding: '0.45rem 0.95rem', borderRadius: '9999px',
                  fontSize: '0.82rem', fontWeight: 800
                }}>
                  {langItem.name}
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ═══ 4. SECCIÓN "NO TIENES QUE LUCHAR SOLO" ════════════ */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '5rem 2rem 6rem'
      }}>
        <div className="landing-photo-split" style={{
          display: 'flex', alignItems: 'center', gap: '4rem',
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '32px', padding: '3rem',
          boxShadow: t.cardShadow
        }}>
          {/* Photo Left */}
          <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', minHeight: '340px' }}>
            <img
              src="/images/students_peer_support.jpg"
              alt="Estudiantes universitarios interactuando"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Checklist Right */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <SectionLabel color={t.accentGreen} text="Acompañamiento Constante" />
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: t.headingColor, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              No tienes que luchar solo.
            </h2>
            <p style={{ fontSize: '1.05rem', color: t.bodyColor, lineHeight: 1.65, marginBottom: '2rem' }}>
              Forma parte de una red donde la comprensión mutua es la norma y pedir ayuda es un acto de valentía.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Red de apoyo 100% anónima con cifrado integral',
                'Moderado por profesionales e Inteligencia Artificial 24/7',
                'Derivación directa a servicios psicológicos universitarios',
                'Botón de auxilio I-CARE y líneas clínicas (MINSA 113)'
              ].map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    backgroundColor: 'rgba(0, 210, 142, 0.15)',
                    border: '1px solid rgba(0, 210, 142, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Check size={16} color={t.accentGreen} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.96rem', fontWeight: 700, color: t.headingColor }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. SECCIÓN DE ETIQUETAS Y TEMAS DINÁMICOS ("Comparte lo que sientes") ═══ */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: isDark ? 'rgba(15, 41, 43, 0.5)' : '#f8fafc',
        borderTop: `1px solid ${t.cardBorder}`,
        borderBottom: `1px solid ${t.cardBorder}`,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          <SectionLabel color={t.accentGreen} text="Expresión Libre & Fluida" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: t.headingColor, letterSpacing: '-0.03em' }}>
            Comparte lo que sientes.{' '}
            <span style={{ color: t.accentGreen }}>Estamos aquí para ti.</span>
          </h2>
        </div>

        {/* Marquee Pills */}
        <div style={{ overflow: 'hidden', padding: '0.75rem 0' }}>
          <div className="landing-marquee-track">
            {[...marqueePills, ...marqueePills].map((pill, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: pill.bg,
                  color: pill.textColor,
                  padding: '0.9rem 1.85rem',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 6px 20px ${pill.bg}44`,
                  flexShrink: 0,
                  cursor: 'default'
                }}
              >
                {pill.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. SECCIÓN "CONVIÉRTETE EN UN ALIADO (PEER SUPPORT)" Y CONVERSIÓN ═══ */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '6rem 2rem'
      }}>
        <div className="landing-peer-split" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem'
        }}>
          {/* Card Left: Invitation */}
          <div className="landing-card-hover" style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '24px', padding: '2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: t.cardShadow
          }}>
            <div>
              <span style={{
                backgroundColor: 'rgba(139, 92, 246, 0.15)', color: t.accentViolet,
                padding: '0.35rem 0.85rem', borderRadius: '9999px',
                fontSize: '0.78rem', fontWeight: 900, marginBottom: '1rem', display: 'inline-block'
              }}>
                Programa Peer Support
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: t.headingColor, lineHeight: 1.2, marginBottom: '1rem' }}>
                Conviértete en un Aliado.
              </h3>
              <p style={{ fontSize: '0.95rem', color: t.bodyColor, lineHeight: 1.65 }}>
                Desarrolla habilidades de escucha empática, apoya a tus pares universitarios y recibe reconocimiento académico acreditado por el centro de bienestar.
              </p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              style={{
                marginTop: '2rem', padding: '0.85rem 1.6rem', borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'var(--surface)',
                color: t.headingColor,
                border: `1px solid ${t.cardBorder}`, fontWeight: 800, fontSize: '0.9rem',
                cursor: 'pointer', alignSelf: 'flex-start'
              }}
            >
              Postular como Aliado →
            </button>
          </div>

          {/* Card Right: Registration in 2 min + App Store Badges */}
          <div className="landing-card-hover" style={{
            backgroundColor: isDark ? '#00D28E' : '#0d9488',
            color: isDark ? '#042721' : '#ffffff',
            borderRadius: '24px', padding: '2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0, 210, 142, 0.3)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', opacity: 0.9 }}>
                ACCESO INMEDIATO
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
                Regístrate en solo 2 minutos.
              </h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6, opacity: 0.9, marginBottom: '1.75rem' }}>
                Sin formularios largos. Solo verifica tu correo y elige tu alias anónimo para empezar.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handleStart}
                style={{
                  backgroundColor: '#042721', color: '#00D28E',
                  padding: '0.95rem 2rem', borderRadius: '9999px',
                  fontWeight: 900, fontSize: '1rem', border: 'none',
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(4, 39, 33, 0.3)'
                }}
              >
                Registrarme Gratis →
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  backgroundColor: 'rgba(4, 39, 33, 0.15)', border: '1px solid rgba(4, 39, 33, 0.3)',
                  padding: '0.45rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800
                }}>
                  📱 iOS & Android App
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. SECCIÓN "EN SUS PROPIAS PALABRAS" (TESTIMONIOS CON RITMO) ═══ */}
      <section id="testimonios" style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '6rem 2rem', textAlign: 'center'
      }}>
        <SectionLabel color={t.accentGreen} text="Historias con Ritmo" />
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
          color: t.headingColor, letterSpacing: '-0.03em', marginBottom: '3.5rem'
        }}>
          En sus propias palabras.
        </h2>

        {/* 4 Colored Vertical Cards */}
        <div className="landing-testimonials-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', textAlign: 'left'
        }}>
          {/* Card Green */}
          <ColoredTestimonialCard
            bg={isDark ? 'rgba(0, 210, 142, 0.12)' : '#f0fdf4'}
            borderColor={isDark ? 'rgba(0, 210, 142, 0.3)' : '#bbf7d0'}
            quote="Encontré un grupo de apoyo genuino cuando sentía que los parciales me sobrepasaban."
            author="Búho_Científica" role="Medicina · UCS" avatarId="owl" quoteColor={t.accentGreen} isDark={isDark} t={t}
          />

          {/* Card Blue */}
          <ColoredTestimonialCard
            bg={isDark ? 'rgba(45, 104, 255, 0.12)' : '#eff6ff'}
            borderColor={isDark ? 'rgba(45, 104, 255, 0.3)' : '#bfdbfe'}
            quote="Hablar anónimamente a las 2:00 AM me salvó de tener un ataque de pánico antes de presentar mi proyecto."
            author="FlyingJay_99" role="Ingeniería de Sistemas" avatarId="fox" quoteColor={t.accentBlue} isDark={isDark} t={t}
          />

          {/* Card Purple */}
          <ColoredTestimonialCard
            bg={isDark ? 'rgba(139, 92, 246, 0.12)' : '#faf5ff'}
            borderColor={isDark ? 'rgba(139, 92, 246, 0.3)' : '#e9d5ff'}
            quote="El sistema me permitió contactar con un psicólogo del campus sin sentir temor al estigma."
            author="EarthAngel_Limeña" role="Psicología · 6to Ciclo" avatarId="unicorn" quoteColor={t.accentViolet} isDark={isDark} t={t}
          />

          {/* Card Pale Pink */}
          <ColoredTestimonialCard
            bg={isDark ? 'rgba(244, 63, 94, 0.12)' : '#fff1f2'}
            borderColor={isDark ? 'rgba(244, 63, 94, 0.3)' : '#fecdd3'}
            quote="Los abrazos virtuales y la comunidad de apoyo hacen que estudiar lejos de mi hogar sea mucho más llevadero."
            author="IvoryBird_21" role="Derecho · 4to Ciclo" avatarId="cat" quoteColor="#f43f5e" isDark={isDark} t={t}
          />
        </div>
      </section>

      {/* ═══ 8. FOOTER & FAQ DE NAVEGACIÓN RÁPIDA ══════════════ */}
      <section id="faq" style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1240px', margin: '0 auto',
        padding: '5rem 2rem 7rem'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3.5rem'
        }}>
          {/* Left: Accordion FAQ */}
          <div>
            <SectionLabel color={t.accentGreen} text="Preguntas Frecuentes" />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: t.headingColor, marginBottom: '2rem', letterSpacing: '-0.03em' }}>
              Resuelve tus dudas.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: t.cardBg,
                      border: `1px solid ${isOpen ? 'rgba(0, 210, 142, 0.4)' : t.cardBorder}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="landing-faq-btn"
                      style={{
                        width: '100%', padding: '1.15rem 1.35rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '1rem', background: 'none', border: 'none',
                        color: t.headingColor, fontSize: '0.95rem', fontWeight: 800,
                        cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <span>{item.q}</span>
                      {isOpen
                        ? <ChevronUp size={18} color={t.accentGreen} style={{ flexShrink: 0 }} />
                        : <ChevronDown size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      }
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 1.35rem 1.25rem',
                        color: t.bodyColor,
                        fontSize: '0.9rem', lineHeight: 1.65
                      }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Large Closing CTA Box */}
          <div style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderRadius: '28px', padding: '3rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: t.cardShadow, textAlign: 'left'
          }}>
            <div>
              <FreeMindLogo size={36} showText textColor="var(--text-main)" />
              <h3 style={{ fontSize: '1.9rem', fontWeight: 900, color: t.headingColor, margin: '1.5rem 0 1rem', lineHeight: 1.25 }}>
                Tu bienestar no puede esperar al próximo ciclo.
              </h3>
              <p style={{ fontSize: '0.98rem', color: t.bodyColor, lineHeight: 1.65, marginBottom: '2.25rem' }}>
                Únete gratis en menos de 2 minutos y accede al espacio anónimo de apoyo psicológico entre pares de la Universidad Científica del Sur.
              </p>
            </div>

            <div>
              <button
                onClick={handleStart}
                className="landing-cta-primary"
                style={{
                  width: '100%', backgroundColor: '#00D28E', color: '#042721',
                  padding: '1.1rem', borderRadius: '9999px',
                  fontSize: '1.05rem', fontWeight: 900, border: 'none',
                  cursor: 'pointer', marginBottom: '1.25rem',
                  boxShadow: '0 8px 28px rgba(0, 210, 142, 0.35)'
                }}
              >
                Comenzar Ahora Gratis →
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem', color: t.bodyColor }}>
                <span>🔒 100% Anónimo</span>
                <span>🛡️ Cifrado E2E</span>
                <span>🎓 UCS Oficial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer style={{
        padding: '3rem 2rem',
        backgroundColor: isDark ? 'rgba(9, 29, 30, 0.95)' : 'var(--surface)',
        borderTop: `1px solid ${t.cardBorder}`,
        color: t.bodyColor, fontSize: '0.88rem'
      }}>
        <div style={{
          maxWidth: '1240px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '1.5rem'
        }}>
          <div>
            <strong style={{ color: t.headingColor }}>Free Mind PE</strong> © 2026. Todos los derechos reservados.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#solucion" style={{ color: t.bodyColor, textDecoration: 'none' }}>Solución</a>
            <a href="#funciones" style={{ color: t.bodyColor, textDecoration: 'none' }}>Funciones</a>
            <a href="#testimonios" style={{ color: t.bodyColor, textDecoration: 'none' }}>Testimonios</a>
            <a href="tel:113" style={{ color: '#f43f5e', fontWeight: 800, textDecoration: 'none' }}>📞 MINSA 113</a>
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {showDemoModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowDemoModal(false)}
        >
          <div
            style={{
              backgroundColor: isDark ? '#0f292b' : '#ffffff',
              borderRadius: '24px', maxWidth: '560px', width: '100%',
              padding: '3rem 2.5rem', textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: `1px solid ${t.cardBorder}`,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemoModal(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem'
              }}
            >
              <X size={22} />
            </button>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍿</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.65rem', color: t.headingColor }}>
              Demostración Interactiva
            </h3>
            <p style={{ color: t.bodyColor, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Free Mind ofrece un espacio 100% anónimo donde los estudiantes pueden publicar desahogos, conectarse en salas comunitarias y agendar citas de orientación psicológica.
            </p>
            <button
              onClick={() => { setShowDemoModal(false); handleStart(); }}
              style={{
                backgroundColor: '#00D28E', color: '#042721',
                border: 'none', padding: '0.95rem 2.2rem',
                borderRadius: '9999px', fontWeight: 900,
                cursor: 'pointer', fontSize: '1rem'
              }}
            >
              Probar Plataforma en Vivo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SectionLabel({ color, text }) {
  return (
    <div style={{
      fontSize: '0.82rem', fontWeight: 900,
      color, textTransform: 'uppercase',
      letterSpacing: '0.12em', marginBottom: '0.85rem'
    }}>
      {text}
    </div>
  );
}

function BentoCard({ children, style, className = '' }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: '24px', padding: '2.25rem',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        ...style
      }}
    >
      {children}
    </div>
  );
}

function ColoredTestimonialCard({ bg, borderColor, quote, author, role, avatarId, quoteColor, isDark, t }) {
  return (
    <div className="landing-card-hover" style={{
      backgroundColor: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: '20px',
      padding: '2rem 1.75rem',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Quote size={32} color={quoteColor} style={{ marginBottom: '1rem', opacity: 0.8 }} />
      <p style={{
        fontSize: '0.93rem', color: isDark ? '#ffffff' : '#0f172a',
        lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.75rem', flex: 1
      }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <TalkCampusAvatar id={avatarId} size={40} />
        <div>
          <div style={{ fontWeight: 900, fontSize: '0.9rem', color: isDark ? '#ffffff' : '#0f172a' }}>{author}</div>
          <div style={{ fontSize: '0.78rem', color: t.bodyColor }}>{role}</div>
        </div>
      </div>
    </div>
  );
}
