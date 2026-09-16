import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Coffee, CloudRain, AlertTriangle } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { trackEvent } from '../utils/tracker';
import { supabase } from '../lib/supabase';
import { AVATARS } from '../utils/constants';
import CareerDropdown from '../components/CareerDropdown';
import { useTranslation } from 'react-i18next';
import { safeJSONParse } from '../utils/helpers';

export default function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [career, setCareer] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const local = safeJSONParse(localStorage.getItem('mente-libre-user'), {});
    if (local?.nickname) {
      setNickname(local.nickname);
      if (local.avatar) setAvatar(local.avatar);
      if (local.career) setCareer(local.career);
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session && !local?.nickname) {
          navigate('/code-entry'); // Redirigir si intenta saltarse el login
        } else if (session?.user) {
          const meta = session.user.user_metadata || {};
          const currentNick = meta.nickname || local?.nickname;
          const currentCareer = meta.career || local?.career;
          const currentAvatar = meta.avatar || local?.avatar || '🦊';

          if (currentNick) setNickname(currentNick);
          if (currentAvatar) setAvatar(currentAvatar);
          if (currentCareer) setCareer(currentCareer);

          if (currentNick && currentCareer) {
            setStep(2); // Ya tiene perfil, saltar directo a elegir estado de ánimo
          }

          // Intentar obtener de public.users si existe la tabla
          supabase.from('users').select('*').eq('id', session.user.id).single()
            .then(({ data, error }) => {
              if (!error && data && data.full_name) {
                setNickname(data.full_name);
                setAvatar(data.avatar_url || '🦊');
                setCareer(data.career || '');
                setStep(2);
              }
            })
            .catch(() => {});
        }
      });
    }
  }, [navigate]);

  const completeOnboarding = async (moodData) => {
    let sessionUser = null;
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      sessionUser = data?.session?.user;
    }

    const local = safeJSONParse(localStorage.getItem('mente-libre-user'), {});
    const newUserData = { 
      id: sessionUser?.id || local?.id,
      email: sessionUser?.email || local?.email,
      nickname, 
      avatar, 
      career, 
      full_name: nickname,
      avatar_url: avatar,
      onboarding_completed: true,
      ...moodData 
    };
    
    setUser(newUserData);
    localStorage.setItem('mente-libre-user', JSON.stringify(newUserData));
    
    // Guardar los datos en Supabase para futuras sesiones
    if (supabase && sessionUser) {
      try {
        // Guardar en metadata de auth para asegurar persistencia de sesión
        await supabase.auth.updateUser({
          data: { nickname, avatar, career, onboarding_completed: true }
        });

        // Intentar guardar en tabla pública (si existe en la BD)
        await supabase.from('users').upsert({
          id: sessionUser.id,
          full_name: nickname,
          avatar_url: avatar,
          career: career,
          onboarding_completed: true
        }, { onConflict: 'id' }).catch(() => {});
      } catch (err) {
        console.error("Error al guardar perfil en Supabase", err);
      }
    }
    
    trackEvent('USER_LOGIN', { career, mood: moodData.mood });
    navigate('/app/feed', { replace: true });
  };

  const handleSOS = () => {
    trackEvent('SOS_TRIGGERED', { career, context: 'onboarding' });
    navigate('/app?sos=true');
  };

  return (
    <div style={{ flex: 1, backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 auto', maxWidth: '400px', width: '100%', padding: '2rem' }}>
        
        {step === 1 ? (
          <div className="animate-slide-up">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('onboarding.identityTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('onboarding.identityDesc')}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ width: '6rem', height: '6rem', margin: '0 auto 1.5rem', backgroundColor: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', border: '2px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                {avatar}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    style={{
                      fontSize: '2rem',
                      aspectRatio: '1/1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: avatar === a ? 'var(--primary-light)' : 'transparent',
                      border: avatar === a ? '2px solid var(--primary)' : '2px solid transparent',
                      transform: avatar === a ? 'scale(1.05)' : 'none',
                      opacity: avatar === a ? 1 : 0.6
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Escribe un seudónimo..."
                maxLength={15}
                style={{
                  width: '100%', padding: '1rem', textAlign: 'center', fontSize: '1.25rem', fontWeight: 800,
                  backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', marginBottom: '1rem',
                  border: '1px solid var(--border-color)', outline: 'none', borderRadius: 'var(--radius-md)'
                }}
              />
              <CareerDropdown 
                value={career} 
                onChange={setCareer} 
                placeholder="Selecciona tu carrera (Científica del Sur)"
              />
            </div>

            <button 
              onClick={() => { if(nickname.trim() && career) setStep(2) }}
              disabled={!nickname.trim() || !career}
              className="btn-primary" 
              style={{ width: '100%', padding: '1.125rem' }}
            >
              Continuar
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('onboarding.checkinTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('onboarding.checkinDesc', { nickname })}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'good', icon: <Sun color="var(--accent-amber)" />, title: "Me siento bien", desc: "Tranquilo, listo para ayudar.", color: 'var(--accent-amber)', action: () => completeOnboarding({ mood: 'Bien' }) },
                { id: 'stressed', icon: <Coffee color="var(--accent-blue)" />, title: "Un poco abrumado", desc: "La universidad me tiene estresado.", color: 'var(--accent-blue)', action: () => completeOnboarding({ mood: 'Abrumado' }) },
                { id: 'sad', icon: <CloudRain color="var(--primary)" />, title: "Triste o ansioso", desc: "Necesito desahogarme un rato.", color: 'var(--primary)', action: () => completeOnboarding({ mood: 'Ansioso' }) },
                { id: 'crisis', icon: <AlertTriangle color="var(--accent-rose)" />, title: t('onboarding.crisisTitle'), desc: t('onboarding.crisisDesc'), color: 'var(--accent-rose)', isCritical: true, action: handleSOS }
              ].map((mood) => (
                <button 
                  key={mood.id}
                  onClick={mood.action}
                  className="card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1rem',
                    backgroundColor: mood.isCritical ? '#fef2f2' : 'var(--surface)',
                    borderColor: mood.isCritical ? '#fecaca' : 'var(--border-color)',
                  }}
                >
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
                    {mood.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem', color: mood.isCritical ? 'var(--accent-rose)' : 'var(--text-main)' }}>{mood.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{mood.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
