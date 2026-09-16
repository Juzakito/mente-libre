import React from 'react';
import { Check, Building2, Shield, Calendar, ArrowRight, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/tracker';

export default function B2BPricingPlans() {
  const { t } = useTranslation();

  const plans = [
    {
      id: 'piloto',
      name: t('b2b.pricing.piloto.name'),
      subtitle: t('b2b.pricing.piloto.subtitle'),
      price: '$4,500',
      period: t('b2b.pricing.piloto.period'),
      capacity: t('b2b.pricing.piloto.capacity'),
      popular: false,
      color: 'var(--primary)',
      features: t('b2b.pricing.piloto.features', { returnObjects: true }),
      cta: t('b2b.pricing.piloto.cta')
    },
    {
      id: 'integral',
      name: t('b2b.pricing.integral.name'),
      subtitle: t('b2b.pricing.integral.subtitle'),
      price: '$1.50',
      period: t('b2b.pricing.integral.period'),
      annualEst: t('b2b.pricing.integral.annualEst'),
      capacity: t('b2b.pricing.integral.capacity'),
      popular: true,
      color: 'var(--primary)',
      badge: t('b2b.pricing.popularBadge'),
      features: t('b2b.pricing.integral.features', { returnObjects: true }),
      cta: t('b2b.pricing.integral.cta')
    },
    {
      id: 'enterprise',
      name: t('b2b.pricing.enterprise.name'),
      subtitle: t('b2b.pricing.enterprise.subtitle'),
      price: t('b2b.pricing.enterprise.price'),
      period: t('b2b.pricing.enterprise.period'),
      capacity: t('b2b.pricing.enterprise.capacity'),
      popular: false,
      color: '#8b5cf6',
      features: t('b2b.pricing.enterprise.features', { returnObjects: true }),
      cta: t('b2b.pricing.enterprise.cta')
    }
  ];

  const handleSelectPlan = (plan) => {
    trackEvent('B2B_PLAN_SELECTED', { planId: plan.id, planName: plan.name });
    window.open('https://calendly.com/jmgonzalez-contact/30min?month=2026-08', '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fade-in 0.3s ease-out' }}>
      
      {/* Title & Value Prop */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          <Building2 size={14} /> {t('b2b.pricing.badge')}
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          {t('b2b.pricing.title')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.4 }}>
          {t('b2b.pricing.subtitle')}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        {plans.map((plan) => {
          const isPopular = plan.popular;
          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '1.25rem',
                border: isPopular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: isPopular 
                  ? '0 12px 25px -10px rgba(13, 148, 136, 0.25)' 
                  : '0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                transform: isPopular ? 'scale(1.01)' : 'scale(1)',
                transition: 'all 0.25s ease'
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-11px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '0.2rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {plan.name}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, minHeight: '34px', lineHeight: 1.35 }}>
                    {plan.subtitle}
                  </p>
                </div>

                {/* Pricing Display */}
                <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: plan.price.length > 6 ? '1.5rem' : '2.1rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>{plan.period}</span>
                  </div>
                  {plan.annualEst && (
                    <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '0.2rem' }}>
                      {plan.annualEst}
                    </span>
                  )}
                  {/* Capacity Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', padding: '0.45rem 0.65rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <Users size={14} color={plan.color} />
                    <span><strong>{t('b2b.pricing.capacity')}</strong> {plan.capacity}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.35 }}>
                      <div style={{
                        backgroundColor: isPopular ? 'var(--primary-light)' : 'var(--bg-color)',
                        color: isPopular ? 'var(--primary)' : 'var(--text-muted)',
                        padding: '0.15rem',
                        borderRadius: '50%',
                        marginTop: '0.1rem',
                        display: 'flex',
                        flexShrink: 0
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: isPopular ? 'none' : '1px solid var(--border-color)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: isPopular ? 'var(--primary)' : 'var(--bg-color)',
                  color: isPopular ? 'white' : 'var(--text-main)',
                  boxShadow: isPopular ? '0 4px 12px -2px rgba(13, 148, 136, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  if (!isPopular) e.currentTarget.style.backgroundColor = 'var(--border-color)';
                  if (isPopular) e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (!isPopular) e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                  if (isPopular) e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
              >
                <Calendar size={15} />
                {plan.cta}
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div style={{ marginTop: '2rem', marginBottom: '2rem', overflowX: 'auto', backgroundColor: 'var(--surface)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px -1px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)', textAlign: 'center' }}>Comparativa Detallada de Planes</h3>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 800, width: '40%', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Funcionalidad</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--primary)', fontWeight: 900, textAlign: 'center', width: '20%', fontSize: '0.95rem' }}>Piloto</th>
              <th style={{ padding: '0.85rem 1rem', color: 'var(--primary)', fontWeight: 900, textAlign: 'center', width: '20%', backgroundColor: 'var(--primary-light)', borderRadius: '0.5rem 0.5rem 0 0', fontSize: '0.95rem' }}>Integral</th>
              <th style={{ padding: '0.85rem 1rem', color: '#8b5cf6', fontWeight: 900, textAlign: 'center', width: '20%', fontSize: '0.95rem' }}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Acceso a App Móvil (Estudiantes)', piloto: true, integral: true, enterprise: true },
              { feature: 'Dashboard B2B Básico', piloto: true, integral: true, enterprise: true },
              { feature: 'Soporte Técnico', piloto: 'Email', integral: 'Prioritario 24/7', enterprise: 'KAM Dedicado' },
              { feature: 'Radar de Bienestar Predictivo (IA)', piloto: false, integral: true, enterprise: true },
              { feature: 'Alertas Tempranas de Deserción', piloto: false, integral: true, enterprise: true },
              { feature: 'Reportes Ejecutivos Exportables', piloto: false, integral: true, enterprise: true },
              { feature: 'Retos Patrocinados (Gamificación)', piloto: false, integral: '3 / semestre', enterprise: 'Ilimitados' },
              { feature: 'Integración SSO (Universidades)', piloto: false, integral: false, enterprise: true },
              { feature: 'SLA de Disponibilidad 99.9%', piloto: false, integral: false, enterprise: true },
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem' }}>{row.feature}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  {typeof row.piloto === 'boolean' ? (row.piloto ? <Check size={16} color="var(--primary)" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>-</span>) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{row.piloto}</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', backgroundColor: 'var(--primary-light)' }}>
                  {typeof row.integral === 'boolean' ? (row.integral ? <Check size={16} color="var(--primary)" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>-</span>) : <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800 }}>{row.integral}</span>}
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  {typeof row.enterprise === 'boolean' ? (row.enterprise ? <Check size={16} color="#8b5cf6" style={{ margin: '0 auto' }} /> : <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>-</span>) : <span style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 800 }}>{row.enterprise}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trust & Compliance Banner */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '260px' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '0.75rem', display: 'flex' }}>
            <Shield size={22} />
          </div>
          <div>
            <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
              Seguridad, Privacidad y Cumplimiento Normativo
            </h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.35 }}>
              Arquitectura anónima de principio a fin. Los datos estudiantiles nunca se vinculan a identidades sin consentimiento.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open('https://calendly.com/jmgonzalez-contact/30min?month=2026-08', '_blank')}
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--primary)',
            border: '1.5px solid var(--primary)',
            borderRadius: '0.6rem',
            padding: '0.6rem 1.2rem',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-light)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface)';
          }}
        >
          Solicitar Piloto Institucional <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
