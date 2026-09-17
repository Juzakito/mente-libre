import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, Calculator, ShieldCheck, Users, 
  FileText, Gift, AlertTriangle, TrendingUp, BarChart3, 
  User, Calendar, ArrowRight, Shield, HeartPulse, ChevronDown, Check,
  Search, Filter, MoreVertical, Mail, MessageSquare, Moon, Sun, LogOut
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { supabase } from '../lib/supabase';
import { useTheme } from '../store/ThemeContext';
import ROICalculator from '../components/ROICalculator';
import B2BPricingPlans from '../components/B2BPricingPlans';
import AppleEmoji from '../components/ui/AppleEmoji';
import LanguageToggle from '../components/ui/LanguageToggle';

const ADMIN_EMAILS = [
  '100199483@cientifica.edu.pe',
  'admin@cientifica.edu.pe',
  'rectorado@cientifica.edu.pe',
  'admin@mentelibre.app'
];

const isMasterAdminEmail = (emailStr) => {
  if (!emailStr) return false;
  return ADMIN_EMAILS.includes(emailStr.trim().toLowerCase());
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '0.6rem', 
      padding: '0.45rem 0.75rem', borderRadius: '0.4rem', border: 'none', 
      backgroundColor: active ? 'var(--primary-light)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? 700 : 600,
      fontSize: '0.825rem', cursor: 'pointer', transition: 'all 0.2s',
      textAlign: 'left', width: '100%'
    }}
    onMouseOver={(e) => !active && (e.currentTarget.style.backgroundColor = 'var(--bg-color)')}
    onMouseOut={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    {React.cloneElement(icon, { size: 16, color: active ? 'var(--primary)' : 'currentColor' })}
    {label}
  </button>
);

const CustomDropdown = ({ value, options, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{ 
          backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)', 
          padding: '0.45rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', 
          fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', 
          gap: '0.4rem', minWidth: '140px', justifyContent: 'space-between',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {options.find(opt => opt.value === value)?.label || label}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.4rem', 
          backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', 
          zIndex: 50, overflow: 'hidden', animation: 'slide-up 0.2s ease-out' 
        }}>
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{ 
                padding: '0.6rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', 
                color: value === opt.value ? 'var(--primary)' : 'var(--text-main)', 
                backgroundColor: value === opt.value ? 'var(--primary-light)' : 'transparent',
                fontWeight: value === opt.value ? 700 : 500,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'background-color 0.1s'
              }}
              onMouseOver={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'var(--bg-color)'; }}
              onMouseOut={e => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt.label}
              {value === opt.value && <Check size={13} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function B2BDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('mente-libre-b2b-auth') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('mente-libre-b2b-auth') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Check auth session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const isMaster = isMasterAdminEmail(session.user.email);
          const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single();
          if (isMaster || (data && (data.role === 'admin' || data.role === 'psychologist'))) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            localStorage.setItem('mente-libre-b2b-auth', 'true');
            if (isMaster && data?.role !== 'admin') {
              supabase.from('users').update({ role: 'admin' }).eq('id', session.user.id).catch(() => {});
            }
          } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
            localStorage.removeItem('mente-libre-b2b-auth');
          }
        }
      });
    } else {
      // Fallback
      setIsAuthenticated(localStorage.getItem('mente-libre-b2b-auth') === 'true');
    }
  }, []);
  
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('b2b_active_tab') || 'analytics');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('b2b_active_tab', activeTab);
  }, [activeTab]);

  const [tabHistory, setTabHistory] = useState([]);
  const [filters, setFilters] = useState({ career: 'Todas', semester: 'Todos', timeframe: '7d' });
  const [showRadarDemo, setShowRadarDemo] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentRiskFilter, setStudentRiskFilter] = useState('Todos');
  const [realStudents, setRealStudents] = useState([]);
  
  const [sosCases, setSosCases] = useState([]);
  const [sosFilter, setSosFilter] = useState('Todos');
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [reportData, setReportData] = useState({ totalPosts: 0, totalComments: 0, totalHugs: 0 });

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoToPreviousTab = () => {
    if (tabHistory.length > 0) {
      const prev = tabHistory[tabHistory.length - 1];
      setTabHistory(prevList => prevList.slice(0, -1));
      setActiveTab(prev);
    } else {
      setActiveTab('analytics');
    }
  };

  const handleBackToApp = (e) => {
    if (e) e.preventDefault();
    const savedUser = localStorage.getItem('mente-libre-user');
    if (savedUser) {
      navigate('/app/feed');
    } else {
      navigate('/');
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const filteredStudents = realStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) || student.id.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesFilter = studentRiskFilter === 'Todos' || student.risk === studentRiskFilter;
    const matchesCareer = filters.career === 'Todas' || student.career === filters.career;
    const matchesSemester = filters.semester === 'Todos' || student.semester === filters.semester;
    return matchesSearch && matchesFilter && matchesCareer && matchesSemester;
  });
  
  const filteredSos = sosCases.filter(sos => {
    if (sosFilter === 'Todos') return true;
    return sos.status === sosFilter;
  });

  const [metrics, setMetrics] = useState({
    activeUsers: 1, valorRetenido: 0, estudiantesRetenidos: 0, 
    sosAlerts: 0, engagementRate: 0, chartData: [], moodDistribution: []
  });

  const fetchMetrics = async () => {
    if (!supabase) return;
    try {
      const { data: moodsData } = await supabase.from('moods').select('*').order('created_at', { ascending: false });
      const { data: postsData } = await supabase.from('posts').select('*');
      const { data: usersData } = await supabase.from('users').select('*').eq('role', 'student');
      
      const activeUsers = usersData?.length || 1;
      const totalPosts = postsData?.length || 0;
      
      // Calculate mood distribution
      let excellent = 0, good = 0, regular = 0, sad = 0, overwhelmed = 0;
      if (moodsData) {
        moodsData.forEach(m => {
          if (m.mood_score === 5) excellent++;
          else if (m.mood_score === 4) good++;
          else if (m.mood_score === 3) regular++;
          else if (m.mood_score === 2) sad++;
          else if (m.mood_score === 1) overwhelmed++;
        });
      }

      const totalMoods = moodsData?.length || 1;
      const newMoodDistribution = [
        { nameKey: 'moodExcellent', value: Math.max(1, excellent), fill: '#10b981' }, 
        { nameKey: 'moodGood', value: Math.max(2, good), fill: '#34d399' }, 
        { nameKey: 'moodRegular', value: Math.max(1, regular), fill: '#fbbf24' }, 
        { nameKey: 'moodSad', value: Math.max(1, sad), fill: '#f472b6' }, 
        { nameKey: 'moodOverwhelmed', value: Math.max(1, overwhelmed), fill: '#f43f5e' }, 
      ];

      // Temporary mock chart data for the UI until we build real time-series aggregations
      const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const newChartData = [1,2,3,4,5,6,0].map(d => ({
        dayKey: dayKeys[d],
        name: dayKeys[d],
        active: Math.floor(Math.random() * 100) + 50,
        stress: Math.floor(Math.random() * 40) + 20,
        engagement: Math.floor(Math.random() * 60) + 40,
        anxiety: Math.floor(Math.random() * 30) + 10,
        burnout: Math.floor(Math.random() * 50) + 10,
        sleep: Math.floor(Math.random() * 40) + 50
      }));

      // Mock real students list based on users table
      if (usersData) {
        setRealStudents(usersData.map(u => ({
          id: u.student_id || u.id.substring(0,8),
          name: u.full_name || 'Estudiante Anónimo',
          career: u.career || 'General',
          semester: u.semester ? `${u.semester}ro` : '1ro',
          risk: 'Bajo',
          riskScore: 20,
          mood: 'Estable',
          lastActive: new Date(u.updated_at).toLocaleDateString(),
          points: 100,
          badges: 1,
          avatar: u.avatar_url || '🦊'
        })));
      }

      setMetrics({
        activeUsers: activeUsers, 
        valorRetenido: activeUsers * 1200, // mock calculation
        estudiantesRetenidos: Math.floor(activeUsers * 0.9),
        sosAlerts: 0, // Should come from interventions table
        engagementRate: 85,
        chartData: newChartData,
        moodDistribution: newMoodDistribution
      });
      
      setReportData({ totalPosts, totalComments: 0, totalHugs: 0 });
    } catch (err) {
      console.error('Error fetching B2B metrics from Supabase:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchMetrics();
  }, [isAuthenticated, filters]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    const isMaster = isMasterAdminEmail(cleanEmail);

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        
        // Verify role
        const { data: userData } = await supabase.from('users').select('role').eq('id', data.user.id).single();
        if (isMaster || (userData && (userData.role === 'admin' || userData.role === 'psychologist'))) {
          setIsAuthenticated(true);
          setIsAdmin(true);
          localStorage.setItem('mente-libre-b2b-auth', 'true');
          // Sincronizar rol de admin en la base de datos si aún figuraba con otro rol
          if (isMaster && userData?.role !== 'admin') {
            await supabase.from('users').update({ role: 'admin' }).eq('id', data.user.id);
          }
        } else {
          setAuthError('No tienes permisos de administrador.');
          await supabase.auth.signOut();
        }
      } catch (err) {
        // Fallback si falla la autenticación de Supabase pero coincide con credenciales locales de rectorado
        if (isMaster && password === '123456') {
          setIsAuthenticated(true);
          setIsAdmin(true);
          localStorage.setItem('mente-libre-b2b-auth', 'true');
        } else {
          setAuthError(err.message || t('b2bDashboard.wrongCredentials'));
        }
      }
    } else {
      // Fallback local
      if (isMaster && password === '123456') {
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('mente-libre-b2b-auth', 'true');
      } else {
        setAuthError(t('b2bDashboard.wrongCredentials'));
      }
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('mente-libre-b2b-auth');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Helper: translate mood keys to display text
  const translateMood = (mood) => {
    const map = { 'Crítico': t('b2bDashboard.moodCritical'), 'Precaución': t('b2bDashboard.moodCaution'), 'Estable': t('b2bDashboard.moodStable') };
    return map[mood] || mood;
  };

  // Helper: translate career keys to display text
  const translateCareer = (career) => {
    const map = {
      'Ingeniería de Sistemas': t('b2bDashboard.ingSistemas'),
      'Ingeniería Industrial': t('b2bDashboard.ingIndustrial'),
      'Medicina': t('b2bDashboard.medicine'),
      'Arquitectura': t('b2bDashboard.architecture'),
      'Derecho': t('b2bDashboard.law'),
      'Psicología': t('b2bDashboard.psychology')
    };
    return map[career] || career;
  };

  // Helper: translate risk level
  const translateRisk = (risk) => {
    const map = { 'Alto': t('b2bDashboard.riskHigh'), 'Medio': t('b2bDashboard.riskMedium'), 'Bajo': t('b2bDashboard.riskLow') };
    return map[risk] || risk;
  };

  // Helper: translate SOS level
  const translateLevel = (level) => {
    const map = { 'Crítico': t('b2bDashboard.levelCritical'), 'Alto': t('b2bDashboard.levelHigh') };
    return map[level] || level;
  };

  // Helper: header title per active tab
  const getHeaderTitle = () => {
    const map = {
      analytics: t('b2bDashboard.headerAnalytics'),
      radar: t('b2bDashboard.headerRadar'),
      roi: t('b2bDashboard.headerRoi'),
      pricing: t('b2bDashboard.headerPricing'),
      estudiantes: t('b2bDashboard.headerStudents'),
      sos: t('b2bDashboard.headerSos'),
      gamificacion: t('b2bDashboard.headerGamification'),
      reportes: t('b2bDashboard.headerReports')
    };
    return map[activeTab] || '';
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-color)',
        backgroundImage: 'radial-gradient(ellipse at 50% 35%, rgba(0, 230, 118, 0.08) 0%, transparent 65%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box'
      }}>
        {/* Top Header Navigation */}
        <header style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <button 
            onClick={handleBackToApp} 
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {t('b2bDashboard.backToApp')}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LanguageToggle />
          </div>
        </header>

        {/* Center Card */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 230, 118, 0.08)',
            border: '1px solid var(--border-color)',
            boxSizing: 'border-box',
            backdropFilter: 'blur(12px)'
          }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                width: '4.5rem',
                height: '4.5rem',
                backgroundColor: 'rgba(0, 230, 118, 0.12)',
                borderRadius: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 230, 118, 0.25)',
                boxShadow: '0 8px 20px rgba(0, 230, 118, 0.15)'
              }}>
                <ShieldCheck size={36} color="#00e676" />
              </div>
            </div>
            
            <h2 style={{ textAlign: 'center', fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {t('b2bDashboard.institutionalAccess')}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2.25rem', lineHeight: 1.5 }}>
              {t('b2bDashboard.enterCredentials')}
            </p>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('b2bDashboard.emailPlaceholder')}
                </label>
                <input 
                  type="email" 
                  placeholder="rectorado@universidad.edu.pe" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  style={{
                    padding: '0.95rem 1.15rem',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontSize: '0.975rem',
                    outline: 'none',
                    fontWeight: 600,
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#00e676';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 230, 118, 0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('b2bDashboard.passwordPlaceholder')}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  style={{
                    padding: '0.95rem 1.15rem',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontSize: '0.975rem',
                    outline: 'none',
                    fontWeight: 600,
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#00e676';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 230, 118, 0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required 
                />
              </div>

              {authError && (
                <div style={{
                  color: '#f43f5e',
                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textAlign: 'center'
                }}>
                  {authError}
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  backgroundColor: '#00e676',
                  color: '#082e30',
                  padding: '1.05rem',
                  borderRadius: '14px',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '0.75rem',
                  boxShadow: '0 8px 24px rgba(0, 230, 118, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#00c853';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#00e676';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t('b2bDashboard.loginButton')}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <footer style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
          Free Mind Institutional Portal • Plataforma de Gestión de Salud Mental Universitaria
        </footer>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Translate chart data for display
  const translatedChartData = metrics.chartData.map(d => ({
    ...d,
    name: t(`b2bDashboard.${d.dayKey}`)
  }));

  const translatedMoodDistribution = metrics.moodDistribution.map(d => ({
    ...d,
    name: t(`b2bDashboard.${d.nameKey}`)
  }));

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-color)', fontFamily: 'system-ui, sans-serif' }}>
       {/* Sidebar */}
       <aside style={{ width: '240px', minWidth: '240px', maxWidth: '240px', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto', flexShrink: 0, backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
          <div style={{ padding: '1rem 1rem 0.6rem 1rem' }}>
             <button 
                onClick={handleBackToApp} 
                style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--border-color)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
             >
                {t('b2bDashboard.backToApp')}
             </button>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
               <img src="/logo.png" alt="Free Mind Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} /> Free Mind
             </h2>
             <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '2.2rem' }}>{t('b2bDashboard.portal')}</span>
          </div>
          
          <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
             <p style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 800, margin: '0.6rem 0 0.3rem 0.75rem', letterSpacing: '0.05em' }}>{t('b2bDashboard.mainMenu')}</p>
             <NavItem icon={<LayoutDashboard />} label={t('b2bDashboard.dashboard')} active={activeTab === 'analytics'} onClick={() => handleTabChange('analytics')} />
             <NavItem icon={<Activity />} label={t('b2bDashboard.earlyRadar')} active={activeTab === 'radar'} onClick={() => handleTabChange('radar')} />
             <NavItem icon={<Calculator />} label={t('b2bDashboard.roiSimulator')} active={activeTab === 'roi'} onClick={() => handleTabChange('roi')} />
             <NavItem icon={<ShieldCheck />} label={t('b2bDashboard.subscriptions')} active={activeTab === 'pricing'} onClick={() => handleTabChange('pricing')} />
             
             <p style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: 800, margin: '0.8rem 0 0.3rem 0.75rem', letterSpacing: '0.05em' }}>{t('b2bDashboard.management')}</p>
             <NavItem icon={<Users />} label={t('b2bDashboard.students')} active={activeTab === 'estudiantes'} onClick={() => handleTabChange('estudiantes')} />
             <NavItem icon={<AlertTriangle />} label={t('b2bDashboard.sosAlerts')} active={activeTab === 'sos'} onClick={() => handleTabChange('sos')} />
             <NavItem icon={<Gift />} label={t('b2bDashboard.gamification')} active={activeTab === 'gamificacion'} onClick={() => handleTabChange('gamificacion')} />
             <NavItem icon={<FileText />} label={t('b2bDashboard.reports')} active={activeTab === 'reportes'} onClick={() => handleTabChange('reportes')} />
          </nav>

          {/* Theme Toggle */}
          <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <button 
              onClick={toggleTheme}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.45rem 0.6rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              {theme === 'light' ? <Moon size={14} color="var(--primary)" /> : <Sun size={14} color="#fbbf24" />}
              <span>{theme === 'light' ? t('b2bDashboard.darkMode') : t('b2bDashboard.lightMode')}</span>
            </button>
          </div>
          
          {/* Language Toggle */}
          <div style={{ padding: '0.5rem 0.75rem' }}>
            <LanguageToggle />
          </div>

          {/* User & Logout */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <User size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                 <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t('b2bDashboard.rector')}</p>
                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.7rem' }}>{t('b2bDashboard.university')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <LogOut size={16} />
            </button>
          </div>
       </aside>

       {/* Main Content */}
       <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', backgroundColor: 'var(--bg-color)' }}>
          {/* Header */}
          <header style={{ backgroundColor: 'var(--surface)', padding: '0.75rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               {activeTab !== 'analytics' && (
                 <button 
                   onClick={handleGoToPreviousTab} 
                   title={t('b2bDashboard.back')}
                   style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '0.4rem 0.65rem', borderRadius: '0.5rem', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                   onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                   onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--bg-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                 >
                   {t('b2bDashboard.back')}
                 </button>
               )}
               <div>
                 <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                   {getHeaderTitle()}
                 </h1>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.15rem 0 0 0' }}>{t('b2bDashboard.headerSubtitle')}</p>
               </div>
             </div>
             
             {/* Global Filters */}
             <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <CustomDropdown 
                  value={filters.career} 
                  onChange={(val) => setFilters({...filters, career: val})}
                  options={[
                    { value: 'Todas', label: t('b2bDashboard.allCareers') },
                    { value: 'Ingeniería de Sistemas', label: t('b2bDashboard.ingSistemas') },
                    { value: 'Ingeniería Industrial', label: t('b2bDashboard.ingIndustrial') },
                    { value: 'Medicina', label: t('b2bDashboard.medicine') },
                    { value: 'Arquitectura', label: t('b2bDashboard.architecture') },
                    { value: 'Derecho', label: t('b2bDashboard.law') },
                    { value: 'Psicología', label: t('b2bDashboard.psychology') }
                  ]} 
                />
                <CustomDropdown 
                  value={filters.semester} 
                  onChange={(val) => setFilters({...filters, semester: val})}
                  options={[
                    { value: 'Todos', label: t('b2bDashboard.allCycles') },
                    ...['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no', '10mo'].map(s => ({ value: s, label: `${s} ${t('b2bDashboard.cycle')}` }))
                  ]} 
                />
             </div>
          </header>

          {/* Content Body */}
          <div style={{ padding: '1.25rem 1.75rem', maxWidth: '1400px', width: '100%', boxSizing: 'border-box' }}>
             
             {activeTab === 'analytics' && (
               <div className="animate-fade-in">
                 {/* Alert Banners */}
                 <div style={{ backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb', border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : '#fde68a'}`, borderRadius: '0.75rem', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.25)' : '#fde68a', color: '#d97706', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}><AlertTriangle size={18} /></div>
                    <div style={{ flex: 1 }}>
                       <h4 style={{ margin: 0, color: theme === 'dark' ? '#fbbf24' : '#92400e', fontWeight: 700, fontSize: '0.9rem' }}>{t('b2bDashboard.alertEmotionalTitle')}</h4>
                       <p style={{ margin: 0, color: theme === 'dark' ? '#fcd34d' : '#b45309', fontSize: '0.8rem' }}>{t('b2bDashboard.alertEmotionalDesc')}</p>
                    </div>
                 </div>

                 <div style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`, borderRadius: '0.75rem', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.25)' : '#fecaca', color: '#dc2626', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}><TrendingUp size={18} /></div>
                    <div style={{ flex: 1 }}>
                       <h4 style={{ margin: 0, color: theme === 'dark' ? '#f87171' : '#991b1b', fontWeight: 700, fontSize: '0.9rem' }}>{t('b2bDashboard.alertStressTitle')}</h4>
                       <p style={{ margin: 0, color: theme === 'dark' ? '#fca5a5' : '#b91c1c', fontSize: '0.8rem' }}>{t('b2bDashboard.alertStressDesc')}</p>
                    </div>
                    <button onClick={() => setIsDeployModalOpen(true)} style={{ backgroundColor: 'var(--surface)', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface)'; }}>{t('b2bDashboard.deployChallenge')}</button>
                 </div>

                 {/* KPI Cards */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: t('b2bDashboard.activeStudents'), value: metrics.activeUsers, icon: <Users />, color: 'var(--primary)', bg: 'var(--primary-light)', badge: t('b2bDashboard.kpiBadgeFreeMind') },
                      { label: t('b2bDashboard.dropoutPrevented'), value: metrics.estudiantesRetenidos, icon: <ShieldCheck />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', badge: t('b2bDashboard.kpiBadgeComplete') },
                      { label: t('b2bDashboard.earlyAlerts'), value: metrics.sosAlerts, icon: <AlertTriangle />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', badge: t('b2bDashboard.kpiBadgeAttention') },
                      { label: t('b2bDashboard.avgEngagement'), value: `${metrics.engagementRate}%`, icon: <Activity />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', badge: '+1.5%' },
                    ].map((kpi, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.15rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ backgroundColor: kpi.bg, color: kpi.color, padding: '0.45rem', borderRadius: '0.5rem', display: 'flex' }}>
                                 {React.cloneElement(kpi.icon, { size: 18 })}
                              </div>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{kpi.label}</span>
                           </div>
                           <span style={{ backgroundColor: kpi.bg, color: kpi.color, padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.68rem', fontWeight: 800 }}>{kpi.badge}</span>
                         </div>
                         <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{kpi.value}</h3>
                         <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-color)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', backgroundColor: kpi.color, borderRadius: '2px' }}></div>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* 2 Column Layout */}
                 <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                    {/* Left Column */}
                    <div>
                       {/* Quick Actions */}
                       <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={16} color="var(--primary)" /> {t('b2bDashboard.quickActions')}
                          </h4>
                          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.15rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', display: 'flex', gap: '1.25rem', overflowX: 'auto' }}>
                             {[
                               { label: t('b2bDashboard.meetings'), icon: <Users size={22} />, bg: 'var(--primary-light)', color: 'var(--primary)', action: () => { setActiveTab('estudiantes'); showToast(t('b2bDashboard.selectStudentMeeting')); } },
                               { label: t('b2bDashboard.appointments'), icon: <Calendar size={22} />, bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', action: () => { setActiveTab('estudiantes'); showToast(t('b2bDashboard.selectStudentAppointment')); } },
                               { label: t('b2bDashboard.sosCases'), icon: <AlertTriangle size={22} />, bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', action: () => setActiveTab('sos') },
                               { label: t('b2bDashboard.executives'), icon: <ShieldCheck size={22} />, bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', action: () => { setActiveTab('analytics'); showToast(t('b2bDashboard.executivesActivated')); } },
                               { label: t('b2bDashboard.reports'), icon: <BarChart3 size={22} />, bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', action: () => setActiveTab('reportes') }
                             ].map((actionItem, idx) => (
                               <div key={idx} onClick={actionItem.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '65px' }}>
                                  <div style={{ width: '50px', height: '50px', backgroundColor: actionItem.bg, color: actionItem.color, borderRadius: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                     {actionItem.icon}
                                  </div>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{actionItem.label}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Charts Area */}
                       <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} color="var(--primary)" /> {t('b2bDashboard.currentPeriodStats')}
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                             <div>
                               <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{t('b2bDashboard.weeklyActivity')}</h5>
                                <div style={{ height: '200px' }}>
                                 <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={translatedChartData}>
                                      <defs>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <XAxis dataKey="name" stroke="var(--text-muted)" axisLine={false} tickLine={false} fontSize={11} tickMargin={10} />
                                      <Tooltip cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }} itemStyle={{ color: 'var(--text-main)' }} />
                                      <Area type="monotone" dataKey="active" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                                    </AreaChart>
                                 </ResponsiveContainer>
                               </div>
                             </div>
                             <div>
                               <h5 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{t('b2bDashboard.emotionalDistribution')}</h5>
                               <div style={{ height: '200px' }}>
                                 <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                     <Pie data={translatedMoodDistribution} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                                       {translatedMoodDistribution.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                       ))}
                                     </Pie>
                                     <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                   </PieChart>
                                 </ResponsiveContainer>
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                       {/* Date Card */}
                       <div style={{ backgroundColor: theme === 'dark' ? 'var(--surface)' : '#0f172a', borderRadius: '1rem', padding: '1.5rem', color: theme === 'dark' ? 'var(--text-main)' : 'white', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.today')}</span>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0 1.5rem 0', textTransform: 'capitalize' }}>{currentDate}</h3>
                          
                          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.upcomingEvents')}</span>
                             <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                               {t('b2bDashboard.noEventsToday')}
                             </div>
                          </div>
                       </div>

                       {/* Meetings Card */}
                       <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                             <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <Users size={16} color="var(--primary)" /> {t('b2bDashboard.meetings')}
                             </h4>
                             <button onClick={() => showToast(t('b2bDashboard.openCalendar'))} style={{ width: '28px', height: '28px', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer' }}>+</button>
                          </div>
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
                            {t('b2bDashboard.noScheduledMeetings')}
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
             )}

             {activeTab === 'roi' && <ROICalculator />}
             {activeTab === 'pricing' && <B2BPricingPlans />}
             {activeTab === 'radar' && (
               <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                 <Activity size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('b2bDashboard.earlyWellnessRadar')}</h2>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('b2bDashboard.radarMapDesc')}</p>
                 <button onClick={() => setShowRadarDemo(!showRadarDemo)} style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s' }}>
                   {showRadarDemo ? t('b2bDashboard.hideMap') : t('b2bDashboard.showHeatMap')}
                 </button>
                 {showRadarDemo && (
                   <div style={{ marginTop: '2.5rem', height: '400px', display: 'flex', justifyContent: 'center' }}>
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                           { subject: t('b2bDashboard.stress'), A: metrics.chartData[0]?.stress || 50, fullMark: 100 },
                           { subject: t('b2bDashboard.anxiety'), A: metrics.chartData[0]?.anxiety || 40, fullMark: 100 },
                           { subject: t('b2bDashboard.burnout'), A: metrics.chartData[0]?.burnout || 60, fullMark: 100 },
                           { subject: t('b2bDashboard.engagement'), A: metrics.chartData[0]?.engagement || 80, fullMark: 100 },
                           { subject: t('b2bDashboard.sleep'), A: metrics.chartData[0]?.sleep || 70, fullMark: 100 },
                        ]}>
                          <PolarGrid stroke="var(--border-color)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                          <Radar name={t('b2bDashboard.wellbeing')} dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
                        </RadarChart>
                     </ResponsiveContainer>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'estudiantes' && (
               <div className="animate-fade-in" style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                 <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', flex: 1, minWidth: '240px' }}>
                      <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem' }} />
                      <input 
                        type="text" 
                        placeholder={t('b2bDashboard.searchByNameOrCode')} 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        style={{ padding: '0.5rem 0.85rem 0.5rem 2.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', width: '100%', fontSize: '0.825rem', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {[
                        { key: 'Todos', label: t('b2bDashboard.all') },
                        { key: 'Alto', label: t('b2bDashboard.riskHigh') },
                        { key: 'Medio', label: t('b2bDashboard.riskMedium') },
                        { key: 'Bajo', label: t('b2bDashboard.riskLow') }
                      ].map(filter => (
                        <button 
                          key={filter.key}
                          onClick={() => setStudentRiskFilter(filter.key)}
                          style={{
                            padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                            border: studentRiskFilter === filter.key ? 'none' : '1px solid var(--border-color)',
                            backgroundColor: studentRiskFilter === filter.key 
                              ? (filter.key === 'Alto' ? '#fef2f2' : filter.key === 'Medio' ? '#fffbeb' : filter.key === 'Bajo' ? '#f0fdf4' : 'var(--primary-light)')
                              : 'transparent',
                            color: studentRiskFilter === filter.key
                              ? (filter.key === 'Alto' ? '#dc2626' : filter.key === 'Medio' ? '#d97706' : filter.key === 'Bajo' ? '#16a34a' : 'var(--primary)')
                              : 'var(--text-muted)',
                            boxShadow: studentRiskFilter === filter.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 <div style={{ overflowX: 'auto' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead>
                       <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.student')}</th>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.program')}</th>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.emotionalState')}</th>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.dropoutRisk')}</th>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.lastActivity')}</th>
                         <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{t('b2bDashboard.action')}</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                         <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                           <td style={{ padding: '0.65rem 1rem' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                               <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', overflow: 'hidden' }}>
                                  {student.avatar ? <AppleEmoji emoji={student.avatar} size={20} /> : student.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                </div>
                               <div>
                                 <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem' }}>{student.name}</div>
                                 <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{student.id}</div>
                               </div>
                             </div>
                           </td>
                           <td style={{ padding: '0.65rem 1rem' }}>
                              <div style={{ color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 500 }}>{translateCareer(student.career)}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{student.semester} {t('b2bDashboard.cycle')}</div>
                           </td>
                           <td style={{ padding: '0.65rem 1rem' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: student.mood === 'Crítico' ? 'rgba(239, 68, 68, 0.15)' : student.mood === 'Precaución' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: `1px solid ${student.mood === 'Crítico' ? '#fecaca' : student.mood === 'Precaución' ? '#fde68a' : '#bbf7d0'}` }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: student.mood === 'Crítico' ? '#ef4444' : student.mood === 'Precaución' ? '#f59e0b' : '#22c55e' }}></div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: student.mood === 'Crítico' ? '#ef4444' : student.mood === 'Precaución' ? '#f59e0b' : '#10b981' }}>{translateMood(student.mood)}</span>
                              </div>
                           </td>
                           <td style={{ padding: '0.65rem 1rem' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', minWidth: '50px' }}>
                                 <div style={{ height: '100%', width: `${student.riskScore}%`, backgroundColor: student.risk === 'Alto' ? '#ef4444' : student.risk === 'Medio' ? '#f59e0b' : '#22c55e' }}></div>
                               </div>
                               <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '24px' }}>{student.riskScore}%</span>
                             </div>
                           </td>
                           <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                             {student.lastActive}
                           </td>
                           <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                             <button onClick={() => window.location.href = `mailto:${student.id.toLowerCase()}@institucion.edu.pe?subject=Apoyo%20Free%20Mind&body=Hola%20${student.name},%0A%0ANos%20ponemos%20en%20contacto%20contigo%20para...`} style={{ padding: '0.35rem 0.65rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-color)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                               <Mail size={13} /> {t('b2bDashboard.contact')}
                             </button>
                           </td>
                         </tr>
                       )) : (
                         <tr>
                           <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                             {t('b2bDashboard.noStudentsFound')}
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {activeTab === 'sos' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('b2bDashboard.activeSosCases')} ({filteredSos.length})</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                       {[
                         { key: 'Todos', label: t('b2bDashboard.allFilter') },
                         { key: 'Pendiente', label: t('b2bDashboard.pendingFilter') },
                         { key: 'En Proceso', label: t('b2bDashboard.inProgressFilter') },
                         { key: 'Resuelto', label: t('b2bDashboard.resolvedFilter') }
                       ].map(filter => (
                         <button 
                           key={filter.key}
                           onClick={() => setSosFilter(filter.key)}
                           style={{
                             padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                             border: sosFilter === filter.key ? 'none' : '1px solid var(--border-color)',
                             backgroundColor: sosFilter === filter.key ? 'var(--primary)' : 'var(--surface)',
                             color: sosFilter === filter.key ? 'white' : 'var(--text-muted)',
                             boxShadow: sosFilter === filter.key ? '0 4px 6px -1px rgba(13,148,136,0.3)' : 'none',
                             transition: 'all 0.2s'
                           }}
                         >
                           {filter.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  {filteredSos.length > 0 ? filteredSos.map(sos => (
                    <div key={sos.id} style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '1.15rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: sos.level === 'Crítico' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: sos.level === 'Crítico' ? '#ef4444' : '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                            {sos.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.85rem' }}>{sos.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ID: {sos.authorId}</div>
                          </div>
                        </div>
                        <div style={{ backgroundColor: sos.level === 'Crítico' ? '#ef4444' : '#f97316', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {translateLevel(sos.level)}
                        </div>
                      </div>
                      
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', flex: 1, border: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>"{sos.text}"</p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{sos.date}</span>
                        <button onClick={() => showToast(`${sos.status === 'Pendiente' ? t('b2bDashboard.caseAssigned') : t('b2bDashboard.caseUpdated')} ${sos.name}`)} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--bg-color)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}>
                          {sos.status === 'Pendiente' ? t('b2bDashboard.interveneCase') : t('b2bDashboard.viewDetails')}
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                      <HeartPulse size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>{t('b2bDashboard.noSosAlerts')}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('b2bDashboard.noSosAlertsDesc')}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gamificacion' && (
                <div className="animate-fade-in" style={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('b2bDashboard.top10Students')}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.15rem 0 0 0' }}>{t('b2bDashboard.top10Desc')}</p>
                    </div>
                    <Gift size={26} color="var(--primary)" />
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.rank')}</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.student')}</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.points')}</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('b2bDashboard.badgesUnlocked')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.length > 0 ? leaderboard.map((student, index) => (
                          <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '0.65rem 1rem' }}>
                              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: index === 0 ? '#fef08a' : index === 1 ? '#e2e8f0' : index === 2 ? '#fed7aa' : 'var(--bg-color)', color: index === 0 ? '#854d0e' : index === 1 ? '#475569' : index === 2 ? '#9a3412' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                                {index + 1}
                              </div>
                            </td>
                            <td style={{ padding: '0.65rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', overflow: 'hidden' }}>
                                  {student.avatar ? <AppleEmoji emoji={student.avatar} size={20} /> : student.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.8rem' }}>{student.name}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{student.id}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '0.65rem 1rem' }}>
                               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: `1px solid var(--primary)` }}>
                                 <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>{student.points} pts</span>
                               </div>
                            </td>
                            <td style={{ padding: '0.65rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                 {Array.from({length: student.badges}).map((_, i) => (
                                    <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fef08a', border: '1px solid #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem' }}>🏆</div>
                                 ))}
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                              {t('b2bDashboard.notEnoughData')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reportes' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
                  <div style={{ gridColumn: 'span 12', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('b2bDashboard.generalImpactReport')}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{t('b2bDashboard.reportDesc')}</p>
                      </div>
                      <button style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }} onClick={() => showToast(t('b2bDashboard.exportingPdf'))}>
                         {t('b2bDashboard.exportPdf')}
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>{t('b2bDashboard.totalPosts')}</div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>{reportData.totalPosts}</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>{t('b2bDashboard.supportComments')}</div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>{reportData.totalComments}</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>{t('b2bDashboard.totalHugsSent')}</div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>{reportData.totalHugs}</div>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>{t('b2bDashboard.sosDetected')}</div>
                        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ef4444' }}>{filteredSos.length}</div>
                      </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--primary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <HeartPulse size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 700 }}>{t('b2bDashboard.wellbeingConclusion')}</h4>
                        <p style={{ margin: 0, marginTop: '0.2rem', color: 'var(--text-main)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                          {t('b2bDashboard.wellbeingConclusionText', { interactions: reportData.totalPosts + reportData.totalComments, hugs: reportData.totalHugs })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

          </div>

          {/* Deploy Challenge Modal */}
          {isDeployModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }} className="animate-fade-in" onClick={() => setIsDeployModalOpen(false)}>
              <div style={{ backgroundColor: 'var(--surface)', borderRadius: '1.25rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()} className="animate-scale-in">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', padding: '1rem', borderRadius: '50%', color: '#dc2626' }}>
                    <TrendingUp size={32} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)' }}>
                  {t('b2bDashboard.modalDeployTitle')}
                </h3>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                  {t('b2bDashboard.modalDeployDesc')}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setIsDeployModalOpen(false)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {t('b2bDashboard.cancel')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsDeployModalOpen(false);
                      showToast(t('b2bDashboard.challengeDeployed'));
                    }}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', backgroundColor: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)' }}
                  >
                    {t('b2bDashboard.confirmDeploy')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', backgroundColor: '#0f172a', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 50, animation: 'fade-in-up 0.3s ease-out' }}>
               <ShieldCheck size={18} color="#10b981" />
               <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toastMessage}</span>
            </div>
          )}
       </main>
    </div>
  );
}
