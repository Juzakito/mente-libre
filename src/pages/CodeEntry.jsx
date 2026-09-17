import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../store/AuthContext';
import { safeJSONParse } from '../utils/helpers';
import { isEmailRegistered, findAccountByIdentifier } from '../services/accountRegistryService';

export default function CodeEntry() {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const checkAndRedirect = async (session) => {
    if (!session?.user) return;
    const meta = session.user.user_metadata || {};
    const local = safeJSONParse(localStorage.getItem('mente-libre-user'), {});
    
    let dbData = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('full_name, avatar_url, career, onboarding_completed').eq('id', session.user.id).single();
        if (!error && data) dbData = data;
      } catch {
        // ignore missing table error
      }
    }

    const nickname = dbData?.full_name || meta.nickname || local?.nickname;
    const avatar = dbData?.avatar_url || meta.avatar || local?.avatar || '🦊';
    const career = dbData?.career || meta.career || local?.career || '';
    const hasCompletedOnboarding = Boolean(
      dbData?.onboarding_completed || 
      meta.onboarding_completed || 
      local?.onboarding_completed || 
      (nickname && career)
    );

    const userData = {
      id: session.user.id,
      email: session.user.email,
      nickname: nickname || session.user.email?.split('@')[0] || 'Estudiante',
      avatar,
      career,
      full_name: nickname || session.user.email?.split('@')[0],
      avatar_url: avatar,
      onboarding_completed: hasCompletedOnboarding
    };

    setUser(userData);
    localStorage.setItem('mente-libre-user', JSON.stringify(userData));

    if (hasCompletedOnboarding && nickname && career) {
      navigate('/app/feed', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) checkAndRedirect(session);
      });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && event === 'SIGNED_IN') checkAndRedirect(session);
      });
      return () => subscription.unsubscribe();
    }
  }, [navigate]);

  const validateEmail = (emailStr) => {
    const trimmed = emailStr.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Por favor ingresa una dirección de correo válida.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailTrimmed = email.trim().toLowerCase();
    
    if (!validateEmail(emailTrimmed)) return;
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: password,
      });
      
      if (signInError) throw signInError;
      if (data?.session) {
        await checkAndRedirect(data.session);
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Por favor verifica tu correo haciendo clic en el enlace que te enviamos al registrarte.');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailTrimmed = email.trim().toLowerCase();
    
    if (!validateEmail(emailTrimmed)) return;
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const alreadyReg = await isEmailRegistered(emailTrimmed);
      if (alreadyReg) {
        setError('Este correo electrónico ya está registrado. Por favor inicia sesión con tu cuenta.');
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password: password,
        options: {
          emailRedirectTo: window.location.origin + '/onboarding'
        }
      });
      
      if (signUpError) throw signUpError;
      
      setSuccessMsg('¡Cuenta creada exitosamente! Entrando a Free Mind...');
    } catch (err) {
      console.error(err);
      if (err.message.includes('User already registered')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(err.message || 'Error al registrar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    const emailTrimmed = email.trim().toLowerCase();
    if (!validateEmail(emailTrimmed)) return;

    setLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
        redirectTo: window.location.origin + '/update-password',
      });
      
      if (resetError) throw resetError;
      
      setSuccessMsg('Si el correo está registrado, hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      setMode('login');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message || 'Error al solicitar restablecimiento de contraseña.'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
  };

  const renderForm = () => {
    if (mode === 'login') {
      return (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="tu.correo@ejemplo.com"
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', fontSize: '1rem', fontWeight: 600, borderColor: error ? 'var(--accent-rose)' : 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Contraseña"
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
            {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>{error}</p>}
          </div>
          <button type="submit" disabled={loading || !email.trim() || !password} className="btn-primary" style={{ width: '100%', padding: '1.125rem', opacity: (loading || !email.trim() || !password) ? 0.7 : 1 }}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => toggleMode('forgot')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem' }}>
              ¿Olvidaste tu contraseña?
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>O</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>
            <button type="button" onClick={() => toggleMode('register')} style={{ background: 'var(--bg-color)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              Crear una cuenta nueva
            </button>
          </div>
        </form>
      );
    }

    if (mode === 'register') {
      return (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="tu.correo@ejemplo.com"
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', fontSize: '1rem', fontWeight: 600, borderColor: error ? 'var(--accent-rose)' : 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Crea una contraseña (min. 6 carácteres)"
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
            {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>{error}</p>}
          </div>
          <button type="submit" disabled={loading || !email.trim() || !password} className="btn-primary" style={{ width: '100%', padding: '1.125rem', opacity: (loading || !email.trim() || !password) ? 0.7 : 1 }}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          
          <button type="button" onClick={() => toggleMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem', marginTop: '0.5rem' }}>
            Ya tengo una cuenta, iniciar sesión
          </button>
        </form>
      );
    }

    if (mode === 'forgot') {
      return (
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
            Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="tu.correo@ejemplo.com"
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 2.75rem', fontSize: '1rem', fontWeight: 600, borderColor: error ? 'var(--accent-rose)' : 'var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', borderRadius: 'var(--radius-md)' }}
              />
            </div>
            {error && <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', marginTop: '0.25rem' }}>{error}</p>}
          </div>
          <button type="submit" disabled={loading || !email.trim()} className="btn-primary" style={{ width: '100%', padding: '1.125rem', opacity: (loading || !email.trim()) ? 0.7 : 1 }}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
          
          <button type="button" onClick={() => toggleMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem', marginTop: '0.5rem' }}>
            Volver a inicio de sesión
          </button>
        </form>
      );
    }
  };

  return (
    <div style={{ flex: 1, minHeight: '100vh', backgroundColor: '#082e30', color: '#ffffff', display: 'flex', flexDirection: 'column', position: 'relative' }} className="animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', padding: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', cursor: 'pointer' }}
      >
        <ChevronLeft size={24} />
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 auto', maxWidth: '420px', width: '100%', padding: '2rem' }}>
        <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'rgba(0, 230, 118, 0.15)', color: '#00e676', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Lock size={28} />
        </div>
        
        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>
          {mode === 'login' ? 'Bienvenido de vuelta' : mode === 'register' ? 'Únete a TalkCampus' : 'Recuperar acceso'}
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', lineHeight: 1.5, fontSize: '0.9rem' }}>
          Espacio seguro y anónimo para estudiantes. Tu identidad real se mantendrá 100% protegida.
        </p>
        
        {successMsg && (
          <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00e676', padding: '0.85rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: '#00e676', fontSize: '0.85rem', fontWeight: 700 }}>{successMsg}</p>
          </div>
        )}

        {renderForm()}
      </div>
    </div>
  );
}

