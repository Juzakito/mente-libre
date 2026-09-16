import React, { useState, useEffect } from 'react';
import { BookOpen, Edit3, X, LogOut, Shield, MessageCircle, Sparkles, Phone, ExternalLink, Lock, Flame, Award, Eye, EyeOff, Star, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CareerDropdown from '../components/CareerDropdown';
import AppleEmoji from '../components/ui/AppleEmoji';
import { useTranslation } from 'react-i18next';

const SHOP_AVATARS = [
  { emoji: '🦉', name: 'Búho Base', cost: 0 },
  { emoji: '🐱', name: 'Gatito Zen', cost: 50 },
  { emoji: '🐶', name: 'Perrito Fiel', cost: 75 },
  { emoji: '🐼', name: 'Panda Dormilón', cost: 100 },
  { emoji: '🦊', name: 'Zorro Astuto', cost: 150 },
  { emoji: '🐸', name: 'Ranita Chill', cost: 200 },
  { emoji: '🦖', name: 'T-Rex Pro', cost: 250 },
  { emoji: '👽', name: 'Alien Zen', cost: 300 },
  { emoji: '🦄', name: 'Unicornio Mágico', cost: 400 },
  { emoji: '🤖', name: 'Robot Coder', cost: 500 },
];

export default function Profile() {
  const { user, posts, updateProfile, logout, feathers, addFeathers, unlockedAvatars, unlockAvatar, showAIAssistant, toggleAIAssistant, showRepliesOnProfile, toggleShowRepliesOnProfile, streak, gamificationPoints, unlockedBadges } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useOutletContext();
  
  const helpResources = [
    { icon: <Phone size={20} color="var(--accent-rose)" />, title: 'Línea 113', desc: 'Ministerio de Salud · 24/7 · Gratuito', action: () => window.open('tel:113') },
    { icon: <MessageCircle size={20} color="var(--primary)" />, title: t('profile.crisisChat'), desc: t('profile.crisisDesc'), action: () => window.open('https://wa.me/51952842623?text=Hola,%20necesito%20ayuda%20psicológica.', '_blank') },
    { icon: <Globe size={20} color="var(--accent-blue)" />, title: 'SiSeve', desc: 'Portal de reporte del MINEDU', action: () => window.open('https://www.siseve.pe', '_blank') },
  ];
  
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(user?.nickname || user?.full_name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '🦊');
  const [editCareer, setEditCareer] = useState(user?.career || '');
  
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [founderCode, setFounderCode] = useState('');

  useEffect(() => {
    // Auto-credit 1000 feathers to founder upon viewing Profile
    const alreadyCredited = localStorage.getItem('mente-libre-founder-auto-1000');
    if (!alreadyCredited) {
      localStorage.setItem('mente-libre-founder-auto-1000', 'true');
      addFeathers(1000);
      showToast('¡1000 Plumas de Fundador acreditadas a tu cuenta! 🎉🪶');
    }
  }, []);

  // Streak is now managed by AppContext, no need for the local simulator effect

  const myPosts = posts.filter(p => p.isMine);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!editNickname.trim() || !editCareer) return;
    await updateProfile(editNickname, editAvatar, editCareer);
    setIsEditing(false);
    showToast('Perfil actualizado');
  };

  const handleEquipOrUnlock = async (avatar) => {
    if (unlockedAvatars.includes(avatar.emoji)) {
      await updateProfile(user.nickname, avatar.emoji, user.career);
      showToast('Avatar equipado 🎉');
    } else {
      if (feathers >= avatar.cost) {
        if (unlockAvatar(avatar.emoji, avatar.cost)) {
          showToast(`¡Has desbloqueado a ${avatar.name}!`);
          await updateProfile(user.nickname, avatar.emoji, user.career);
        }
      } else {
        showToast('No tienes suficientes Plumas 😢');
      }
    }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%', paddingBottom: '6rem' }}>
      
      {/* Profile Card */}
      <div style={{ 
        background: 'linear-gradient(145deg, color-mix(in srgb, var(--primary) 90%, black), color-mix(in srgb, var(--primary) 40%, black))', 
        borderRadius: '28px', 
        padding: '2.5rem 1.5rem', 
        color: 'white', 
        textAlign: 'center', 
        position: 'relative',
        boxShadow: '0 25px 50px -12px color-mix(in srgb, var(--primary) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
        overflow: 'hidden',
        border: '1px solid color-mix(in srgb, var(--primary) 60%, transparent)'
      }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 50%)', pointerEvents: 'none' }}></div>
        
        {!isEditing ? (
          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
            <button 
              onClick={() => setIsEditing(true)}
              style={{ position: 'absolute', top: '-1rem', right: '-0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <Edit3 size={16} />
            </button>
            <div style={{ width: '6rem', height: '6rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 0 30px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.1)' }}>
              <AppleEmoji emoji={user.avatar} size={48} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{user.nickname}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(5px)' }}>
                <BookOpen size={14} /> {user.career || 'Estudiante'}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: 'white', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)' }}>
                <Flame size={14} fill="white" /> Racha: {streak} {streak === 1 ? 'día' : 'días'}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', textAlign: 'center' }}>Editar Perfil</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avatar</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {unlockedAvatars.map(a => (
                  <button
                    key={a}
                    onClick={() => setEditAvatar(a)}
                    style={{
                      fontSize: '1.75rem', width: '3.5rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: editAvatar === a ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      border: editAvatar === a ? '2px solid white' : '1px solid transparent',
                      cursor: 'pointer',
                      transform: editAvatar === a ? 'scale(1.1)' : 'none',
                      boxShadow: editAvatar === a ? '0 8px 16px rgba(0,0,0,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <AppleEmoji emoji={a} size={32} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('profile.pseudonym')}</label>
              <input 
                type="text" 
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                placeholder="Tu seudónimo"
                maxLength={15}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800, backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', outline: 'none', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'white'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Carrera</label>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <CareerDropdown 
                  value={editCareer} 
                  onChange={setEditCareer} 
                  placeholder="Selecciona tu carrera"
                  variant="profile"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ flex: 1, padding: '1rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: 'var(--radius-full)', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={!editNickname.trim() || !editCareer}
                style={{ flex: 1, padding: '1rem', backgroundColor: 'white', color: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 900, cursor: 'pointer', opacity: (!editNickname.trim() || !editCareer) ? 0.5 : 1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
              >
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem 0.5rem', backgroundColor: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--accent-orange) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Flame size={18} color="var(--accent-orange)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Días Seguidos</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem 0.5rem', backgroundColor: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--accent-blue) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Star size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{gamificationPoints}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Puntos</div>
        </div>

        <div 
          onClick={() => setShowFounderModal(true)}
          style={{ 
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            padding: '1.25rem 0.5rem', 
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent) 0%, color-mix(in srgb, var(--primary) 5%, transparent) 100%)', 
            borderRadius: '20px', 
            border: '1px solid color-mix(in srgb, var(--primary) 40%, transparent)', 
            boxShadow: '0 4px 12px color-mix(in srgb, var(--primary) 15%, transparent)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          title="Toca para ver o reclamar beneficios de Fundador"
        >
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--primary) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '1.25rem', display: 'flex' }}><AppleEmoji emoji="🪶" size={24} /></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{feathers}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Plumas <Sparkles size={10} />
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
          <Award size={18} color="var(--primary)" /> Mis Insignias
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
          {[
            { id: 'first_step', icon: '🌱', title: 'Primer Paso', desc: 'Registra un estado', color: 'var(--accent-emerald)' },
            { id: 'streak_3', icon: '🔥', title: 'Constancia', desc: 'Racha de 3 días', color: 'var(--accent-orange)' },
            { id: 'streak_7', icon: '⭐', title: 'Semana Perfecta', desc: 'Racha de 7 días', color: 'var(--accent-amber)' },
            { id: 'pomodoro_master', icon: '🍅', title: 'Enfoque Total', desc: '100 Puntos', color: 'var(--accent-rose)' },
            { id: 'mental_guru', icon: '🧠', title: 'Gurú Mental', desc: '500 Puntos', color: 'var(--primary)' },
          ].map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div key={badge.id} style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
                minWidth: '110px', padding: '1.25rem 0.5rem', 
                backgroundColor: isUnlocked ? 'var(--surface)' : 'color-mix(in srgb, var(--surface) 50%, transparent)', 
                border: `1px solid ${isUnlocked ? 'var(--border-color)' : 'transparent'}`, 
                borderRadius: '20px', boxShadow: isUnlocked ? 'var(--shadow-sm)' : 'none', 
                position: 'relative', overflow: 'hidden',
                opacity: isUnlocked ? 1 : 0.4, filter: isUnlocked ? 'none' : 'grayscale(1)'
              }}>
                {isUnlocked && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: badge.color }}></div>}
                
                <div style={{ fontSize: '2rem', filter: isUnlocked ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none' }}>
                  <AppleEmoji emoji={badge.icon} size={32} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-main)', textAlign: 'center' }}>{badge.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.1rem' }}>{badge.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avatar Shop */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" /> Tienda de Avatares
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('profile.unlockStyles')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 900, fontSize: '0.85rem' }}>
            {feathers} <span style={{ fontSize: '1rem' }}>🪶</span>
          </div>
        </div>

        <div className="no-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory' }}>
          {SHOP_AVATARS.map((avatar) => {
            const isUnlocked = unlockedAvatars.includes(avatar.emoji);
            const isEquipped = user.avatar === avatar.emoji;
            const canAfford = feathers >= avatar.cost;

            return (
              <div key={avatar.name} style={{
                flex: '0 0 140px',
                scrollSnapAlign: 'start',
                backgroundColor: isEquipped ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'var(--bg-color)',
                border: `2px solid ${isEquipped ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: '20px',
                padding: '1.25rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                position: 'relative',
                transition: 'all 0.2s',
                boxShadow: isEquipped ? '0 8px 16px color-mix(in srgb, var(--primary) 15%, transparent)' : 'none'
              }}>
                {!isUnlocked && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: 'var(--text-light)', backgroundColor: 'var(--surface)', padding: '0.25rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <Lock size={12} />
                  </div>
                )}
                
                {isEquipped && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 'inherit', background: 'radial-gradient(circle at center, color-mix(in srgb, var(--primary) 10%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                )}

                <div style={{ filter: !isUnlocked ? 'grayscale(100%) opacity(0.4)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))', transition: 'all 0.3s', display: 'flex', justifyContent: 'center' }}>
                  <AppleEmoji emoji={avatar.emoji} size={64} />
                </div>
                
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: isEquipped ? 'var(--primary)' : 'var(--text-main)' }}>
                    {avatar.name}
                  </div>
                  {!isUnlocked && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: canAfford ? 'var(--primary)' : 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {avatar.cost} 🪶
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleEquipOrUnlock(avatar)}
                  disabled={!isUnlocked && !canAfford}
                  style={{
                    marginTop: 'auto',
                    width: 'calc(100% - 1.5rem)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    cursor: (!isUnlocked && !canAfford) ? 'not-allowed' : 'pointer',
                    backgroundColor: isEquipped ? 'var(--primary)' : (isUnlocked ? 'var(--surface)' : (canAfford ? 'var(--primary)' : 'var(--surface)')),
                    color: isEquipped ? 'white' : (isUnlocked ? 'var(--text-main)' : (canAfford ? 'white' : 'var(--text-muted)')),
                    border: (isUnlocked && !isEquipped) || (!isUnlocked && !canAfford) ? '1px solid var(--border-color)' : 'none',
                    boxShadow: canAfford && !isUnlocked ? '0 4px 10px color-mix(in srgb, var(--primary) 30%, transparent)' : 'none',
                    transition: 'all 0.2s',
                    zIndex: 1
                  }}
                  onMouseOver={e => {
                    if ((isUnlocked && !isEquipped) || (canAfford && !isUnlocked)) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isEquipped ? 'Equipado' : isUnlocked ? 'Equipar' : 'Desbloquear'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Resources */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
          <Shield size={14} /> Contactos de Emergencia
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {helpResources.map((r, i) => (
            <button
              key={i}
              onClick={r.action}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', width: '100%', padding: '1.25rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--surface)'}
            >
              <div style={{ fontSize: '1.5rem', backgroundColor: 'var(--bg-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '0.9rem' }}>{r.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{r.desc}</div>
              </div>
              <ExternalLink size={16} color="var(--text-light)" />
            </button>
          ))}
        </div>
      </div>



      {/* Settings / Preferences */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
          Configuración
        </h3>
        <button 
          onClick={toggleAIAssistant}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
            {showAIAssistant ? <Eye size={18} color="var(--primary)" /> : <EyeOff size={18} color="var(--text-muted)" />}
            Mostrar Burbuja de Asistente IA
          </div>
          <div style={{ width: '40px', height: '24px', backgroundColor: showAIAssistant ? 'var(--primary)' : 'var(--bg-color)', borderRadius: '12px', position: 'relative', transition: 'background-color 0.3s' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: showAIAssistant ? '18px' : '2px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
          </div>
        </button>
        
        <button 
          onClick={toggleShowRepliesOnProfile}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 700 }}>
            {showRepliesOnProfile ? <Eye size={18} color="var(--primary)" /> : <EyeOff size={18} color="var(--text-muted)" />}
            Mostrar respuestas en mi perfil
          </div>
          <div style={{ width: '40px', height: '24px', backgroundColor: showRepliesOnProfile ? 'var(--primary)' : 'var(--bg-color)', borderRadius: '12px', position: 'relative', transition: 'background-color 0.3s' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: showRepliesOnProfile ? '18px' : '2px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
          </div>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout} 
        style={{ width: '100%', color: 'var(--accent-rose)', fontWeight: 900, backgroundColor: 'color-mix(in srgb, var(--accent-rose) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-rose) 20%, transparent)', padding: '1rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-rose) 15%, transparent)'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-rose) 10%, transparent)'}
      >
        <LogOut size={18} /> {t('profile.logout')}
      </button>

      {/* Founder Modal */}
      {showFounderModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowFounderModal(false)}>
          <div style={{
            background: 'linear-gradient(145deg, var(--surface) 0%, var(--bg-color) 100%)',
            border: '1px solid color-mix(in srgb, var(--accent-orange) 40%, transparent)',
            borderRadius: '28px',
            padding: '2rem',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 30px color-mix(in srgb, var(--accent-orange) 20%, transparent)',
            textAlign: 'center',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowFounderModal(false)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-orange) 30%, transparent) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-orange) 30%, transparent)'
            }}>
              <AppleEmoji emoji="🔥" size={42} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Insignia de Fundador
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Beneficios exclusivos del creador de Free Mind
            </p>

            <div style={{
              backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Balance Actual
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {feathers} <span style={{ fontSize: '1.25rem' }}>🪶</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  addFeathers(1000);
                  showToast('¡1000 Plumas de Fundador añadidas! 🎉🪶');
                  setShowFounderModal(false);
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 8px 20px color-mix(in srgb, var(--primary) 30%, transparent)'
                }}
              >
                <Sparkles size={18} /> Reclamar +1000 Plumas
              </button>

              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  O ingresa tu contraseña de creador (123456):
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="password"
                    placeholder="123456"
                    value={founderCode}
                    onChange={e => setFounderCode(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (founderCode === '123456') {
                          addFeathers(1000);
                          showToast('¡Acceso Fundador verificado! +1000 Plumas 🎉');
                          setFounderCode('');
                          setShowFounderModal(false);
                        } else {
                          showToast('Contraseña incorrecta');
                        }
                      }
                    }}
                    style={{
                      flex: 1, padding: '0.65rem 1rem', borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)',
                      color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (founderCode === '123456') {
                        addFeathers(1000);
                        showToast('¡Acceso Fundador verificado! +1000 Plumas 🎉');
                        setFounderCode('');
                        setShowFounderModal(false);
                      } else {
                        showToast('Contraseña incorrecta');
                      }
                    }}
                    style={{
                      padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-orange)', color: 'white',
                      fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer'
                    }}
                  >
                    Activar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
