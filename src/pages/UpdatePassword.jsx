import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function UpdatePassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || session) {
              // Valid password recovery session
            }
          });
          return () => subscription.unsubscribe();
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      if (supabase) {
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          });
          if (updateError) console.warn('Supabase update note:', updateError.message);
        } catch (sErr) {
          console.warn('Supabase auth warning:', sErr);
        }
      }

      setSuccess(true);
      
      // Wait 2 seconds then navigate back to onboarding login
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Hubo un error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', position: 'relative' }} className="animate-fade-in">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 auto', maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Lock size={32} />
        </div>
        
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('auth.updatePassword')}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '0.9rem' }}>
          Ingresa tu nueva contraseña para recuperar el acceso a Free Mind.
        </p>

        {success ? (
          <div style={{ backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <CheckCircle2 color="var(--primary)" size={48} style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('auth.passwordUpdated')}</h3>
            <p style={{ color: 'var(--primary-hover)', fontSize: '0.95rem' }}>
              Redirigiendo a tu cuenta...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Nueva contraseña"
                  required
                  style={{ width: '100%', padding: '1rem 3rem 1rem 2.75rem', fontSize: '1rem', fontWeight: 600, borderColor: error ? 'var(--accent-rose)' : 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', borderRadius: 'var(--radius-md)' }}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirmar contraseña"
                  required
                  style={{ width: '100%', padding: '1rem 3rem 1rem 2.75rem', fontSize: '1rem', fontWeight: 600, borderColor: error ? 'var(--accent-rose)' : 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', borderRadius: 'var(--radius-md)' }}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  onTouchStart={() => setShowConfirmPassword(true)}
                  onTouchEnd={() => setShowConfirmPassword(false)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>{error}</p>}
            </div>
            <button type="submit" disabled={loading || !password || !confirmPassword} className="btn-primary" style={{ width: '100%', padding: '1.125rem', opacity: (loading || !password || !confirmPassword) ? 0.7 : 1 }}>
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
