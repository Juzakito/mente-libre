import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Mail, Eye, EyeOff, CheckCircle2, KeyRound, Send } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import TalkCampusAvatar from '../components/ui/TalkCampusAvatar';
import TalkCampusLogo from '../components/ui/TalkCampusLogo';
import AppleEmoji from '../components/ui/AppleEmoji';
import CareerDropdown from '../components/CareerDropdown';
import { supabase } from '../lib/supabase';
import { isEmailRegistered, isNicknameRegistered, findAccountByIdentifier, registerAccount } from '../services/accountRegistryService';

const AVATAR_OPTIONS = ['👻', '👽', '🤖', '🦊', '🦉', '🐱', '🦖', '🦦'];

const HOOK_QUOTES = [
  {
    avatarId: 'anxious_soul',
    author: 'Anxious_Soul',
    vibeText: 'Ansioso',
    vibeEmoji: '🥺',
    vibeBg: '#3b82f6',
    highlight: 'Hoy fue un punto de quiebre.',
    body: ' Siento que tengo que estar siempre disponible. Es tan agotador.'
  },
  {
    avatarId: 'owl',
    author: 'Búho_Científica',
    vibeText: 'Estresado',
    vibeEmoji: '📚',
    vibeBg: '#f59e0b',
    highlight: 'Los exámenes finales me paralizan.',
    body: ' Necesito saber que no soy el único que siente que se queda atrás.'
  },
  {
    avatarId: 'fox',
    author: 'FlyingJay_99',
    vibeText: 'Inseguro',
    vibeEmoji: '💭',
    vibeBg: '#a855f7',
    highlight: 'A veces siento que no pertenezco aquí.',
    body: ' Pero desahogarme en esta red anónima me devolvió la tranquilidad.'
  },
  {
    avatarId: 'unicorn',
    author: 'EarthAngel_Limeña',
    vibeText: 'Esperanzado',
    vibeEmoji: '🌿',
    vibeBg: '#10b981',
    highlight: 'Encontré un grupo de apoyo sin prejuicios.',
    body: ' Pedir ayuda a tiempo cambió totalmente mi perspectiva de la universidad.'
  },
  {
    avatarId: 'cat',
    author: 'IvoryBird_21',
    vibeText: 'Desahogo',
    vibeEmoji: '💙',
    vibeBg: '#ec4899',
    highlight: 'Estudiar lejos de mi hogar es muy duro.',
    body: ' Los abrazos virtuales y el apoyo constante de mis pares me dan fuerza cada día.'
  },
  {
    avatarId: 'otter',
    author: 'Nutria_Chill',
    vibeText: 'Tranquilo',
    vibeEmoji: '🦦',
    vibeBg: '#06b6d4',
    highlight: 'Superé los momentos más difíciles.',
    body: ' Gracias a la empatía diaria y al acompañamiento continuo de la comunidad.'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Screen 1 (Hook), Screen 2 (Email Registration / Login), Screen 3 (Tu Identidad Anónima)
  const [screen, setScreen] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Quote rotation state (every 30s)
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);

  useEffect(() => {
    if (screen !== 1) return;

    const interval = setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % HOOK_QUOTES.length);
        setQuoteFading(false);
      }, 400);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [screen]);

  const currentQuote = HOOK_QUOTES[quoteIndex];

  // Screen 2 Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [optInUpdates, setOptInUpdates] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Password Recovery states
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetSentAddress, setResetSentAddress] = useState('');

  // Screen 3 Customization states (Image 2)
  const [avatar, setAvatar] = useState('🦊');
  const [nickname, setNickname] = useState('');
  const [career, setCareer] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.nickname && user?.onboarding_completed) {
      // Allow re-visiting if explicitly navigated, or go to feed
    }
  }, [user]);

  const handleContinueToEmail = () => {
    setIsLoginMode(false);
    setIsForgotPasswordMode(false);
    setError('');
    setScreen(2);
  };

  const handleOpenLogin = () => {
    setIsLoginMode(true);
    setIsForgotPasswordMode(false);
    setError('');
    setScreen(2);
  };

  const handleBackToHook = () => {
    setScreen(1);
    setError('');
    setIsLoginMode(false);
    setIsForgotPasswordMode(false);
  };

  const handleOpenForgotPassword = () => {
    setIsForgotPasswordMode(true);
    setResetEmail(email.trim());
    setError('');
    setResetSuccess(false);
  };

  const handleSendPasswordReset = async (e) => {
    e?.preventDefault();
    setError('');

    const inputVal = (resetEmail || email).trim();
    if (!inputVal) {
      setError('Por favor ingresa tu correo electrónico o seudónimo.');
      return;
    }

    setLoading(true);

    try {
      let targetEmail = inputVal.toLowerCase();
      const account = await findAccountByIdentifier(inputVal);
      if (account?.email) {
        targetEmail = account.email.toLowerCase();
      }

      if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
        if (!account) {
          setError(`No encontramos ninguna cuenta o seudónimo registrado con "${inputVal}". Por favor verifica tus datos.`);
          setLoading(false);
          return;
        }
      }

      if (supabase) {
        try {
          const { error: resetErr } = await supabase.auth.resetPasswordForEmail(targetEmail, {
            redirectTo: `${window.location.origin}/update-password`
          });
          if (resetErr) console.warn('Supabase password reset notice:', resetErr.message);
        } catch (sErr) {
          console.warn('Supabase reset warning:', sErr);
        }
      }

      setResetSentAddress(targetEmail);
      setResetSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar la solicitud de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEmail = async (e) => {
    e?.preventDefault();
    setError('');

    const inputVal = email.trim();
    if (!inputVal) {
      setError('Por favor ingresa tu correo electrónico o seudónimo.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Por favor ingresa tu contraseña (mínimo 4 caracteres).');
      return;
    }

    if (isLoginMode) {
      // Existing user direct login flow by email OR pseudonym
      setLoading(true);
      try {
        const foundAccount = await findAccountByIdentifier(inputVal);
        if (foundAccount) {
          setUser(foundAccount);
          localStorage.setItem('mente-libre-user', JSON.stringify(foundAccount));
          navigate('/app/feed', { replace: true });
        } else {
          setError(`No encontramos ninguna cuenta con el correo o seudónimo "${inputVal}". Por favor regístrate como usuario nuevo.`);
        }
      } catch (err) {
        console.error(err);
        setError('Error al iniciar sesión. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // New user registration flow
    if (!inputVal.includes('@') || !inputVal.includes('.')) {
      setError('Por favor ingresa una dirección de correo válida.');
      return;
    }

    if (!agreeTerms) {
      setError('Debes aceptar los términos y el consentimiento para continuar.');
      return;
    }

    setLoading(true);
    try {
      const emailTaken = await isEmailRegistered(inputVal);
      if (emailTaken) {
        setError(`El correo "${inputVal}" ya está registrado. Por favor haz clic en "Iniciar sesión" para ingresar.`);
        setLoading(false);
        return;
      }
      setScreen(3);
    } catch (err) {
      console.error(err);
      setScreen(3);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeOnboarding = async (e) => {
    e?.preventDefault();
    setError('');

    const trimmedNick = nickname.trim();
    if (!trimmedNick) {
      setError('Por favor ingresa tu seudónimo anónimo.');
      return;
    }

    if (!career) {
      setError('Por favor selecciona tu carrera para personalizar tu experiencia.');
      return;
    }

    setLoading(true);

    try {
      // Check if nickname/pseudonym is ALREADY TAKEN!
      const nickTaken = await isNicknameRegistered(trimmedNick);
      if (nickTaken) {
        setError(`El seudónimo "${trimmedNick}" ya está en uso por otro estudiante. Por favor elige un alias diferente.`);
        setLoading(false);
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        email: email.trim().toLowerCase(),
        nickname: trimmedNick,
        avatar: avatar,
        career: career,
        full_name: trimmedNick,
        onboarding_completed: true,
        needs_email_verification: true,
        opt_in_updates: optInUpdates,
        created_at: new Date().toISOString()
      };

      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            newUser.id = session.user.id;
          }
        } catch {}
      }

      // Register new user into central registry
      registerAccount(newUser);

      setUser(newUser);
      localStorage.setItem('mente-libre-user', JSON.stringify(newUser));
      localStorage.setItem('tc_unverified_email', email.trim().toLowerCase());

      navigate('/app/feed', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar tu solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      flex: 1,
      backgroundColor: screen === 3 ? 'var(--bg-color)' : '#082e30',
      color: '#ffffff',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Top Header Bar: Logo on left, Iniciar sesión on right */}
      <div style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <TalkCampusLogo size={38} showText={false} />
        </div>

        <button
          onClick={handleOpenLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Iniciar sesión
        </button>
      </div>

      {/* =========================================================
          SCREEN 1: EMOTIONAL HOOK / QUOTE (IMAGE 1)
         ========================================================= */}
      {screen === 1 && (
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '1050px',
          margin: '0 auto',
          padding: '1.5rem 3.5rem 5rem',
          width: '100%',
          boxSizing: 'border-box'
        }} className="animate-fade-in">
          {/* Quote Card Container with Smooth Fade & Slide Transition */}
          <div
            style={{
              opacity: quoteFading ? 0 : 1,
              transform: quoteFading ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: '280px'
            }}
          >
            {/* User Profile Header with Mood Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.25rem' }}>
              <TalkCampusAvatar
                id={currentQuote.avatarId}
                size={64}
                style={{
                  borderRadius: '18px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  border: '1.5px solid rgba(0, 210, 142, 0.5)'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: currentQuote.vibeBg,
                  color: '#ffffff',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  width: 'fit-content',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}>
                  <span>{currentQuote.vibeText}</span>
                  <AppleEmoji emoji={currentQuote.vibeEmoji} size={16} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                  {currentQuote.author}
                </div>
              </div>
            </div>

            {/* Giant Quote Typography */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'rgba(255, 255, 255, 0.45)',
              marginBottom: '2.5rem',
              maxWidth: '960px'
            }}>
              <span style={{ color: '#ffffff' }}>{currentQuote.highlight}</span>
              {currentQuote.body}
            </h1>
          </div>

          {/* Explanatory Subtext */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2.5rem',
            maxWidth: '540px',
            lineHeight: 1.45
          }}>
            Una comunidad universitaria libre de juicios para apoyarse mutuamente
          </p>

          {/* Quote Rotation Pagination Dots & Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleContinueToEmail}
              style={{
                backgroundColor: '#00e676',
                color: '#082e30',
                border: 'none',
                padding: '1.15rem 4rem',
                borderRadius: '9999px',
                fontSize: '1.2rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(0, 230, 118, 0.45)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00c853';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00e676';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Continuar
            </button>

            {/* Interactive Dots for 30s Quote Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} aria-label="Navegar entre historias">
              {HOOK_QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === quoteIndex) return;
                    setQuoteFading(true);
                    setTimeout(() => {
                      setQuoteIndex(idx);
                      setQuoteFading(false);
                    }, 350);
                  }}
                  title={`Ver historia ${idx + 1}`}
                  style={{
                    width: idx === quoteIndex ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '9999px',
                    backgroundColor: idx === quoteIndex ? '#00e676' : 'rgba(255, 255, 255, 0.25)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* =========================================================
          SCREEN 2: EMAIL & INVITATION CARD (IMAGE 1)
         ========================================================= */}
      {screen === 2 && (
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 1.25rem 3rem'
        }} className="animate-fade-in">
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#141819',
            borderRadius: '20px',
            padding: '1.75rem 1.75rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem'
          }}>
            {isForgotPasswordMode ? (
              /* =========================================================
                 PASSWORD RECOVERY CARD VIEW
                 ========================================================= */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 230, 118, 0.12)',
                  border: '1px solid rgba(0, 230, 118, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <KeyRound size={28} color="#00e676" />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem' }}>
                    Recuperar Contraseña
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.45, margin: 0 }}>
                    Ingresa tu correo o tu seudónimo (ej: <strong>Josh</strong>). Te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                </div>

                {error && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    color: '#fca5a5',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    {error}
                  </div>
                )}

                {resetSuccess ? (
                  <div style={{
                    backgroundColor: 'rgba(0, 230, 118, 0.08)',
                    border: '1.5px solid rgba(0, 230, 118, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem 1.25rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }} className="animate-slide-down">
                    <CheckCircle2 size={48} color="#00e676" />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.35rem' }}>
                        ¡Correo Enviado con Éxito!
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.45, margin: 0 }}>
                        Hemos enviado las instrucciones para restablecer tu contraseña a <strong style={{ color: '#00e676' }}>{resetSentAddress}</strong>. Revisa tu bandeja de entrada.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => navigate('/update-password')}
                        style={{
                          width: '100%',
                          backgroundColor: '#00e676',
                          color: '#082e30',
                          border: 'none',
                          padding: '0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.95rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 6px 20px rgba(0, 230, 118, 0.35)'
                        }}
                      >
                        Crear nueva contraseña ahora
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(false);
                          setResetSuccess(false);
                          setError('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Volver al inicio de sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        value={resetEmail}
                        onChange={(e) => { setResetEmail(e.target.value); setError(''); }}
                        placeholder="Correo o seudónimo (ej: Josh)"
                        required
                        style={{
                          width: '100%',
                          backgroundColor: '#202528',
                          border: '1px solid rgba(0, 230, 118, 0.35)',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem 0.85rem 2.8rem',
                          fontSize: '0.92rem',
                          color: '#ffffff',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        backgroundColor: '#00e676',
                        color: '#082e30',
                        border: 'none',
                        padding: '0.9rem',
                        borderRadius: '9999px',
                        fontSize: '1rem',
                        fontWeight: 900,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 6px 20px rgba(0, 230, 118, 0.4)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Send size={18} />
                      {loading ? 'Enviando correo...' : 'Enviar correo de restablecimiento'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(false);
                          setError('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#00e676',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        ← Volver a Iniciar Sesión
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* =========================================================
                 EXISTING LOGIN / REGISTER FORM
                 ========================================================= */
              <>
                <button
                  onClick={handleBackToHook}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: 0,
                    width: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.85
                  }}
                >
                  <ArrowLeft size={22} />
                </button>

                {isLoginMode && (
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0, 230, 118, 0.12)',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.25rem'
                  }}>
                    <Lock size={24} color="#00e676" />
                  </div>
                )}

                <div style={{ textAlign: isLoginMode ? 'center' : 'left' }}>
                  <h2 style={{
                    fontSize: '1.55rem',
                    fontWeight: 900,
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    margin: '0 0 0.4rem'
                  }}>
                    {isLoginMode ? 'Bienvenido de vuelta' : 'Ingresa tu correo para comenzar'}
                  </h2>
                  {isLoginMode && (
                    <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.45, margin: 0 }}>
                      Free Mind es un espacio seguro para estudiantes universitarios. Tu identidad real se mantendrá anónima en la plataforma.
                    </p>
                  )}
                </div>

                {error && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    color: '#fca5a5',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegisterEmail} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                  {/* Field 1: Correo o Seudónimo */}
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder={isLoginMode ? "Correo o seudónimo (ej: Josh)" : "tu.correo@gmail.com"}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#202528',
                        border: '1px solid rgba(0, 230, 118, 0.35)',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem 0.85rem 2.8rem',
                        fontSize: '0.92rem',
                        color: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Field 2: Contraseña */}
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder={isLoginMode ? "Contraseña" : "Crea tu contraseña (mínimo 6 caracteres)"}
                      required
                      style={{
                        width: '100%',
                        backgroundColor: '#202528',
                        border: '1px solid rgba(0, 230, 118, 0.35)',
                        borderRadius: '12px',
                        padding: '0.85rem 2.8rem 0.85rem 2.8rem',
                        fontSize: '0.92rem',
                        color: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {!isLoginMode && (
                    <>
                      <div>
                        <button
                          type="button"
                          onClick={() => setHasInviteCode(!hasInviteCode)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            textDecoration: 'underline',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left'
                          }}
                        >
                          Tengo un código de invitación (opcional)
                        </button>

                        {hasInviteCode && (
                          <div style={{ marginTop: '0.5rem' }} className="animate-slide-down">
                            <input
                              type="text"
                              value={inviteCode}
                              onChange={(e) => setInviteCode(e.target.value)}
                              placeholder="Código de invitación (ej: UCS-2026)"
                              style={{
                                width: '100%',
                                backgroundColor: '#202528',
                                border: '1px solid rgba(0, 230, 118, 0.4)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                fontSize: '0.9rem',
                                color: '#ffffff',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                          <div
                            onClick={() => setOptInUpdates(!optInUpdates)}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: optInUpdates ? '#00e676' : 'transparent',
                              border: optInUpdates ? 'none' : '2px solid rgba(255, 255, 255, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px',
                              flexShrink: 0,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {optInUpdates && <Check size={12} color="#082e30" strokeWidth={3} />}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.35 }}>
                            Mantenme informado con correos sobre actualizaciones y más.
                          </span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                          <div
                            onClick={() => setAgreeTerms(!agreeTerms)}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: agreeTerms ? '#00e676' : 'transparent',
                              border: agreeTerms ? 'none' : '2px solid rgba(255, 255, 255, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: '2px',
                              flexShrink: 0,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {agreeTerms && <Check size={12} color="#082e30" strokeWidth={3} />}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.35 }}>
                            Acepto los <span style={{ textDecoration: 'underline' }}>Términos y Política de Privacidad</span>,
                            {' '}y doy mi consentimiento para compartir mi experiencia de forma anónima y segura en Free Mind.
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      backgroundColor: '#00e676',
                      color: '#082e30',
                      border: 'none',
                      padding: '0.9rem',
                      borderRadius: '9999px',
                      fontSize: '1rem',
                      fontWeight: 900,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 6px 20px rgba(0, 230, 118, 0.4)',
                      transition: 'all 0.2s ease',
                      marginTop: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#00c853'; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#00e676'; }}
                  >
                    {loading ? (isLoginMode ? 'Iniciando sesión...' : 'Guardando...') : (isLoginMode ? 'Iniciar Sesión' : 'Continuar')}
                  </button>

                  {isLoginMode && (
                    <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                      <button
                        type="button"
                        onClick={handleOpenForgotPassword}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#00e676',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </main>
      )}

      {/* =========================================================
          SCREEN 3: TU IDENTIDAD ANÓNIMA (IMAGE 2)
         ========================================================= */}
      {screen === 3 && (
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 1.25rem 4rem'
        }} className="animate-fade-in">
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxSizing: 'border-box'
          }}>
            {/* Back Arrow */}
            <button
              onClick={() => setScreen(2)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: 0,
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ArrowLeft size={22} />
            </button>

            {/* Titles */}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{
                fontSize: '1.85rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                margin: '0 0 0.4rem 0',
                letterSpacing: '-0.02em'
              }}>
                Tu Identidad Anónima
              </h2>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                margin: 0
              }}>
                Elige cómo te verán en la comunidad.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem',
                color: '#f43f5e',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                {error}
              </div>
            )}

            {/* Avatar Preview Circle */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0' }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-color)',
                border: '3px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <AppleEmoji emoji={avatar} size={54} />
              </div>
            </div>

            {/* Avatar Selection Grid (2x4) */}
            <div style={{
              backgroundColor: 'var(--bg-color)',
              border: '1.5px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              boxSizing: 'border-box'
            }}>
              {AVATAR_OPTIONS.map((emojiOption) => {
                const isSelected = avatar === emojiOption;
                return (
                  <button
                    key={emojiOption}
                    type="button"
                    onClick={() => setAvatar(emojiOption)}
                    style={{
                      height: '58px',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? 'rgba(0, 230, 118, 0.12)' : 'var(--surface)',
                      border: isSelected ? '2px solid #00e676' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 230, 118, 0.2)' : 'none'
                    }}
                  >
                    <AppleEmoji emoji={emojiOption} size={32} />
                  </button>
                );
              })}
            </div>

            {/* Form Fields: Seudónimo & Carrera */}
            <form onSubmit={handleFinalizeOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Seudónimo Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Seudónimo Anónimo
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); setError(''); }}
                  placeholder="ej: Estudiante Anónimo"
                  maxLength={18}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '14px',
                    outline: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#00e676'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  required
                />
              </div>

              {/* Carrera Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tu Carrera Universitaria
                </label>
                <CareerDropdown
                  value={career}
                  onChange={(val) => { setCareer(val); setError(''); }}
                  placeholder="Selecciona tu carrera..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#00e676',
                  color: '#082e30',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '9999px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 230, 118, 0.35)',
                  transition: 'all 0.2s ease',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#00c853';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#00e676';
                }}
              >
                {loading ? 'Guardando...' : 'Continuar'}
              </button>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}

