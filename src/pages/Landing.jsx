import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BarChart2, Sparkles, Shield, MessageCircle, Heart, Lock, ArrowRight, Moon, Sun, Building, Clock, Bot } from 'lucide-react';
import LanguageToggle from '../components/ui/LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isAuthLoading && user && user.nickname) {
      navigate('/app/feed', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  const features = [
    { icon: <Lock size={24} />, title: t('landing.features.anonymousTitle'), desc: t('landing.features.anonymousDesc'), color: 'var(--primary)', bg: 'var(--primary-light)' },
    { icon: <MessageCircle size={24} />, title: t('landing.features.chatTitle'), desc: t('landing.features.chatDesc'), color: 'var(--accent-blue)', bg: 'color-mix(in srgb, var(--accent-blue) 15%, transparent)' },
    { icon: <Heart size={24} />, title: t('landing.features.communityTitle'), desc: t('landing.features.communityDesc'), color: 'var(--accent-rose)', bg: 'var(--bg-danger)' },
    { icon: <Shield size={24} />, title: t('landing.features.sosTitle'), desc: t('landing.features.sosDesc'), color: 'var(--accent-amber)', bg: 'color-mix(in srgb, var(--accent-amber) 15%, transparent)' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflowY: 'auto', position: 'relative' }}>
      {/* Background decorations - Glassmorphism Animated Mesh - Fixed to viewport */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        {/* Subtle Grid Overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Animated Glowing Orbs */}
        <div className="animate-float-1" style={{ position: 'absolute', top: '5%', left: '-5%', width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px', background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 20%, transparent) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div className="animate-float-2" style={{ position: 'absolute', bottom: '5%', right: '-5%', width: '45vw', height: '45vw', maxWidth: '600px', maxHeight: '600px', background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-blue) 15%, transparent) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
        <div className="animate-float-1" style={{ position: 'absolute', top: '40%', left: '30%', width: '30vw', height: '30vw', maxWidth: '400px', maxHeight: '400px', background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-amber) 10%, transparent) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animationDuration: '22s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="glass compact-nav-padding" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 900, fontSize: '1.35rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: theme === 'dark' ? 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }}>
            <img src="/logo.png" alt="Free Mind Logo" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
          </div>
          <span className="hide-on-mobile">Free Mind</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: 'var(--text-main)', 
              width: '2.25rem', 
              height: '2.25rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '1px solid var(--border-color)', 
              cursor: 'pointer',
              flexShrink: 0 
            }}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <LanguageToggle />
          <button className="btn-secondary" onClick={() => navigate('/b2b')} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={16} color="var(--primary)" /> <span className="hide-on-mobile">Universidades & ROI</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '5rem 2rem 4rem', textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-fade-in">

        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-hover)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '2rem', border: '1px solid rgba(13,148,136,0.2)' }}>
          <Shield size={14} /> {t('landing.heroBadge')}
        </div>
        
        <h1 style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--secondary)', marginBottom: '1.5rem', maxWidth: '800px', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 auto 1.5rem' }}>
          {t('landing.heroTitle')} <br />
          <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('landing.heroSubtitle')}</span>
        </h1>
        
        <p style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '550px', lineHeight: 1.7, margin: '0 auto 2.5rem' }}>
          {t('landing.heroDesc')}
        </p>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 4px 14px rgba(13,148,136,0.4)' }} 
            onClick={() => navigate(user?.nickname ? '/app/feed' : '/code-entry')}
          >
            {user?.nickname ? `Continuar al Feed` : t('landing.studentBtn')} <ArrowRight size={18} />
          </button>
        </div>

        {/* Trusted by */}
        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{t('landing.designedFor')}</span>
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            🎓 Universidad Científica del Sur
          </div>
        </div>
      </header>

      {/* CTA */}
      <section style={{ padding: '3rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0f766e 100%)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>{t('landing.cta.title')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1rem' }}>{t('landing.cta.desc')}</p>
          <button onClick={() => navigate('/code-entry')} style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {t('landing.cta.btn')} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '3rem 2rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {[
          { value: '24/7', label: t('landing.stats.support'), icon: <Clock size={28} />, color: 'var(--primary)', bg: 'color-mix(in srgb, var(--primary) 15%, transparent)' },
          { value: '100%', label: t('landing.stats.anonymous'), icon: <Lock size={28} />, color: 'var(--accent-amber)', bg: 'color-mix(in srgb, var(--accent-amber) 15%, transparent)' },
          { value: 'IA', label: t('landing.stats.ai'), icon: <Bot size={28} />, color: 'var(--accent-blue)', bg: 'color-mix(in srgb, var(--accent-blue) 15%, transparent)' }
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', backgroundColor: s.bg, color: s.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: `0 4px 20px ${s.bg}`, border: `1px solid ${s.bg}` }}>
              {s.icon}
            </div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--secondary)', lineHeight: 1 }}>{s.value}</h3>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem' }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('landing.howItWorksTitle')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{t('landing.howItWorksDesc')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div key={i} className="card animate-fade-in" style={{ padding: '2rem 1.5rem', textAlign: 'center', cursor: 'default', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', animationDelay: `${i * 100}ms` }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: f.bg, borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: f.color, boxShadow: `0 8px 16px ${f.bg}` }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.15rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional B2B Highlight Section */}
      <section style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '1.75rem',
          padding: '2.5rem',
          color: 'white',
          border: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {t('landing.b2bSection.badge')}
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', color: 'white' }}>
              {t('landing.b2bSection.title')}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              {t('landing.b2bSection.desc')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/b2b')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.9rem 1.75rem',
                borderRadius: '1rem',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <BarChart2 size={18} /> {t('landing.b2bExplore')} <ArrowRight size={16} />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
              {t('landing.b2bSection.noCommitment')}
            </span>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.8rem', position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-color)' }}>
        <p style={{ fontWeight: 600 }}>{t('landing.footer.copyright')}</p>
        <p style={{ marginTop: '0.25rem' }}>{t('landing.footer.tagline')}</p>
      </footer>
    </div>
  );
}
