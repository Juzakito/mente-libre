import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, Calendar, ArrowRight, CheckCircle2, AlertTriangle, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/tracker';

export default function ROICalculator() {
  const { t } = useTranslation();
  const [totalStudents, setTotalStudents] = useState(2000);
  const [annualTuition, setAnnualTuition] = useState(2500);
  const [dropoutRate, setDropoutRate] = useState(10);
  const [preventionRate, setPreventionRate] = useState(15);

  // Financial Calculations
  const potentialDropouts = Math.round((totalStudents * dropoutRate) / 100);
  const retainedStudents = Math.max(1, Math.round((potentialDropouts * preventionRate) / 100));
  const savedTuition = retainedStudents * annualTuition;
  
  // Cost: $12 per user per year for enterprise (example), capped at large discounts
  const estimatedPlatformCost = Math.round(totalStudents * (totalStudents > 10000 ? 5 : totalStudents > 5000 ? 8 : 12));
  const netSavings = Math.max(0, savedTuition - estimatedPlatformCost);
  const roiMultiplier = estimatedPlatformCost > 0 ? (savedTuition / estimatedPlatformCost).toFixed(1) : '0';
  
  // Cost of Inaction (COI)
  const costOfInaction = potentialDropouts * annualTuition;

  // Generate 5-year projection data
  const projectionData = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const yearSavings = savedTuition * (1 + (i * 0.15)); 
    return {
      name: `Año ${i + 1}`,
      'Ahorro Neto': Math.round(yearSavings - estimatedPlatformCost),
      'Costo Inacción': costOfInaction * (1 + (i * 0.05)) 
    };
  });

  const handleBookDemo = () => {
    trackEvent('B2B_CALENDLY_ROI_CLICKED', { totalStudents, savedTuition, roiMultiplier });
    window.open('https://calendly.com/jmgonzalez-contact/30min?month=2026-08', '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fade-in 0.3s ease-out' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '0.75rem', display: 'flex' }}>
            <Calculator size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{t('b2b.roi.title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.15rem 0 0 0' }}>{t('b2b.roi.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        
        {/* Sliders Card */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.02)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={18} color="var(--primary)" /> {t('b2b.roi.paramsTitle')}
          </h4>

          {/* Slider 1: Total Students */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('b2b.roi.students')}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '0.95rem' }}>{totalStudents.toLocaleString()} {t('b2b.roi.studentsUnit')}</span>
            </div>
            <input 
              type="range" 
              min="1000" max="40000" step="500" 
              value={totalStudents} 
              onChange={(e) => setTotalStudents(Number(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none', background: `linear-gradient(to right, var(--primary) ${((totalStudents - 1000) / 39000) * 100}%, var(--border-color) ${((totalStudents - 1000) / 39000) * 100}%)`, outline: 'none' }}
            />
          </div>

          {/* Slider 2: Tuition Cost */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('b2b.roi.tuition')}</span>
              <span style={{ color: '#10b981', fontWeight: 900, fontSize: '0.95rem' }}>${annualTuition.toLocaleString()} USD</span>
            </div>
            <input 
              type="range" 
              min="1200" max="10000" step="200" 
              value={annualTuition} 
              onChange={(e) => setAnnualTuition(Number(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none', background: `linear-gradient(to right, #10b981 ${((annualTuition - 1200) / 8800) * 100}%, var(--border-color) ${((annualTuition - 1200) / 8800) * 100}%)`, outline: 'none' }}
            />
          </div>

          {/* Slider 3: Desertion Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('b2b.roi.dropout')}</span>
              <span style={{ color: '#f43f5e', fontWeight: 900, fontSize: '0.95rem' }}>{dropoutRate}% {t('b2b.roi.dropoutUnit')}</span>
            </div>
            <input 
              type="range" 
              min="5" max="25" step="1" 
              value={dropoutRate} 
              onChange={(e) => setDropoutRate(Number(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none', background: `linear-gradient(to right, #f43f5e ${((dropoutRate - 5) / 20) * 100}%, var(--border-color) ${((dropoutRate - 5) / 20) * 100}%)`, outline: 'none' }}
            />
          </div>

          {/* Slider 4: Prevention Rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('b2b.roi.prevention')}</span>
              <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.95rem' }}>{preventionRate}% {t('b2b.roi.preventionUnit')}</span>
            </div>
            <input 
              type="range" 
              min="10" max="35" step="1" 
              value={preventionRate} 
              onChange={(e) => setPreventionRate(Number(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', appearance: 'none', background: `linear-gradient(to right, #f59e0b ${((preventionRate - 10) / 25) * 100}%, var(--border-color) ${((preventionRate - 10) / 25) * 100}%)`, outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button onClick={() => setPreventionRate(10)} style={{ flex: 1, padding: '0.45rem', backgroundColor: preventionRate === 10 ? 'var(--primary-light)' : 'var(--surface)', border: preventionRate === 10 ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '0.4rem', color: preventionRate === 10 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t('b2b.roi.conservador')}</button>
              <button onClick={() => setPreventionRate(20)} style={{ flex: 1, padding: '0.45rem', backgroundColor: preventionRate === 20 ? 'var(--primary-light)' : 'var(--surface)', border: preventionRate === 20 ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '0.4rem', color: preventionRate === 20 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t('b2b.roi.estandar')}</button>
              <button onClick={() => setPreventionRate(35)} style={{ flex: 1, padding: '0.45rem', backgroundColor: preventionRate === 35 ? 'var(--primary-light)' : 'var(--surface)', border: preventionRate === 35 ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '0.4rem', color: preventionRate === 35 ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t('b2b.roi.optimo')}</button>
            </div>
          </div>

          {/* Cost of Inaction Alert */}
          <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <AlertTriangle size={26} color="#f43f5e" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Costo de Inacción Anual</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f43f5e', marginTop: '0.15rem' }}>${costOfInaction.toLocaleString()} USD</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Pérdida estimada si no se retiene a los {potentialDropouts} estudiantes en riesgo.</div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '1.5rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Subtle gradient overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'radial-gradient(circle at top right, var(--primary-light), transparent 60%)', pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
              <TrendingUp size={14} color="var(--primary)" /> {t('b2b.roi.resultsTitle')}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('b2b.roi.savings')}</span>
              <div style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1, margin: '0.35rem 0', letterSpacing: '-0.02em' }}>
                ${savedTuition.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>USD</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{t('b2b.roi.savingsDesc')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>{t('b2b.roi.retained')}:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{retainedStudents}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>{t('b2b.roi.roiMult')}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>{roiMultiplier}x</span>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> {t('b2b.roi.costEst')} <strong style={{ color: 'var(--text-main)', marginLeft: 'auto' }}>${estimatedPlatformCost.toLocaleString()} USD/año</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> {t('b2b.roi.benefit')} <strong style={{ color: '#10b981', marginLeft: 'auto' }}>+${netSavings.toLocaleString()} USD</strong>
              </li>
            </ul>

            {/* 5-Year Projection Chart */}
            <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <BarChart3 size={14} color="var(--primary)" /> Proyección a 5 Años
              </div>
              <div style={{ height: '150px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInaccion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', color: 'var(--text-main)', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 700 }} />
                    <Area type="monotone" dataKey="Ahorro Neto" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAhorro)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="Costo Inacción" stroke="#f43f5e" fillOpacity={1} fill="url(#colorInaccion)" strokeWidth={1.5} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookDemo}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.85rem 1.5rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              zIndex: 10
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
          >
            <Calendar size={18} />
            {t('b2b.roi.book')}
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
