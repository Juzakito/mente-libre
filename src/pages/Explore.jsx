import React, { useState, useEffect } from 'react';
import { Search, Heart, Sparkles, EyeOff, Edit3, Trash2, Check, Wind, BookOpen, Headphones, Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppleEmoji from '../components/ui/AppleEmoji';
import { safeJSONParse } from '../utils/helpers';
import { useAppContext } from '../context/AppContext';
import MusicCatalog from '../features/explore/MusicCatalog';
import PomodoroTimer from '../features/explore/PomodoroTimer';
import ExamAnxietyGuide from '../features/explore/ExamAnxietyGuide';

export default function Explore() {
  const { t } = useTranslation();
  const { posts } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [breathingPhase, setBreathingPhase] = useState('Inhala');
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const resources = [
    { 
      title: 'Ansiedad en Exámenes', 
      type: 'Herramienta', 
      icon: <BookOpen size={20} />, 
      text: 'var(--accent-emerald)',
      content: <ExamAnxietyGuide /> 
    },
    { 
      title: 'Música y Sonidos', 
      type: 'Audio', 
      icon: <Headphones size={20} />, 
      text: 'var(--accent-blue)',
      content: <MusicCatalog />
    },
    { 
      title: 'Técnica Pomodoro', 
      type: 'Herramienta', 
      icon: <Play size={20} />, 
      text: 'var(--accent-rose)',
      content: <PomodoroTimer /> 
    }
  ];

  // Generar sonido relajante
  const playBreathingSound = (freq = 432) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 2);
    } catch(e) {
      console.warn("Audio playback interrupted", e);
    }
  };

  useEffect(() => {
    let interval;
    if (isBreathing) {
      playBreathingSound(432);
      let cycle = 0;
      interval = setInterval(() => {
        cycle = (cycle + 1) % 3;
        if (cycle === 0) { setBreathingPhase('Inhala'); playBreathingSound(432); }
        if (cycle === 1) { setBreathingPhase('Mantén'); playBreathingSound(300); }
        if (cycle === 2) { setBreathingPhase('Exhala'); playBreathingSound(200); }
      }, 4000);
    } else {
      setBreathingPhase('Inhala');
    }
    return () => clearInterval(interval);
  }, [isBreathing]);
  
  const filtered = posts.filter(p => p.text.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%', padding: '1.5rem 1rem 6rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxSizing: 'border-box' }}>
      
      {/* Breathing Minigame */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wind size={20} color="var(--primary)" /> {t('explore.takeABreath')}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Un minuto de respiración consciente puede reducir tu ansiedad al instante.
        </p>
        
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {isBreathing && (
            <div className={`breathing-circle ${breathingPhase.toLowerCase()}`} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'var(--primary)', opacity: 0.2, borderRadius: '50%' }}></div>
          )}
          <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: 'white', fontWeight: 800, fontSize: '1.25rem', boxShadow: '0 10px 25px rgba(13,148,136,0.4)', transition: 'all 4s ease-in-out', transform: isBreathing ? (breathingPhase === 'Inhala' ? 'scale(1.2)' : breathingPhase === 'Exhala' ? 'scale(0.8)' : 'scale(1.2)') : 'scale(1)' }}>
            {isBreathing ? breathingPhase : 'Empezar'}
          </div>
        </div>
        
        <button 
          onClick={() => setIsBreathing(!isBreathing)}
          className="btn-primary" 
          style={{ width: '100%', maxWidth: '250px', padding: '0.75rem', borderRadius: 'var(--radius-full)' }}
        >
          {isBreathing ? 'Detener' : 'Iniciar 1 Minuto'}
        </button>
      </div>

      {/* Resource Cards */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>Recursos Recomendados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {resources.map((res, i) => (
            <div key={i} onClick={() => setSelectedResource(res)} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}>
              <div style={{ color: res.text, backgroundColor: 'var(--bg-color)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{res.icon}</div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: res.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{res.type}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, marginTop: '0.25rem' }}>{res.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Community Search */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '1rem' }}>Buscar en Comunidad</h3>
      
        <div style={{ backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Search color="var(--text-light)" size={20} style={{ marginLeft: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Buscar publicaciones..."
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', padding: '0.25rem 0', fontSize: '0.875rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(post => <ExplorePostCard key={post.id} post={post} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
              No se encontraron publicaciones.
            </div>
          )}
        </div>
      </div>
      
      {selectedResource && (
        <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }} onClick={onClose} className="animate-fade-in">
      <div 
        style={{ 
          background: 'linear-gradient(145deg, var(--surface) 0%, var(--bg-color) 100%)', 
          borderRadius: '24px', 
          padding: '2rem', 
          width: '100%', 
          maxWidth: '420px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)', 
          border: '1px solid var(--border-color)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }} 
        onClick={(e) => e.stopPropagation()} 
        className="animate-slide-up"
      >
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at top right, color-mix(in srgb, ${resource.text} 15%, transparent), transparent 50%)`, pointerEvents: 'none' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              color: resource.text, 
              background: `linear-gradient(135deg, color-mix(in srgb, ${resource.text} 20%, transparent) 0%, color-mix(in srgb, ${resource.text} 10%, transparent) 100%)`,
              border: `1px solid color-mix(in srgb, ${resource.text} 30%, transparent)`,
              width: '3.5rem', height: '3.5rem', 
              borderRadius: '1rem', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: `0 8px 16px color-mix(in srgb, ${resource.text} 20%, transparent)`
            }}>
              {React.cloneElement(resource.icon, { size: 28 })}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: resource.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{resource.type}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>{resource.title}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='var(--surface)'} onMouseOut={e => e.currentTarget.style.backgroundColor='var(--bg-color)'}>
            <X size={16} />
          </button>
        </div>
        
        <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', zIndex: 1, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
          {resource.content}
        </div>
        
        <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
          <button 
            onClick={onClose} 
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              backgroundColor: resource.text, 
              color: 'white', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '1rem', 
              fontWeight: 800, 
              border: 'none', 
              cursor: 'pointer', 
              boxShadow: `0 8px 16px color-mix(in srgb, ${resource.text} 40%, transparent)`, 
              transition: 'all 0.2s ease', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }} 
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 20px color-mix(in srgb, ${resource.text} 60%, transparent)`; }} 
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 16px color-mix(in srgb, ${resource.text} 40%, transparent)`; }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

function ExplorePostCard({ post }) {
  const { deletePost, updatePost, toggleHug } = useAppContext();
  const [showSensitive, setShowSensitive] = useState(!post.isSensitive);
  const [hugs, setHugs] = useState(post.hugs);
  const [related, setRelated] = useState(post.related);
  const [hugAnimating, setHugAnimating] = useState(false);
  const [relatedAnimating, setRelatedAnimating] = useState(false);
  const [hasHugged, setHasHugged] = useState(() => {
    try { return safeJSONParse(localStorage.getItem('likedPosts'), []).includes(post.id); } catch { return false; }
  });
  const [hasRelated, setHasRelated] = useState(() => {
    try { return safeJSONParse(localStorage.getItem('relatedPosts'), []).includes(post.id); } catch { return false; }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const handleHug = () => {
    toggleHug(post.id, post.hugs, !hasHugged);
    let liked = [];
    try { liked = safeJSONParse(localStorage.getItem('likedPosts'), []); } catch {}
    
    if (hasHugged) {
      setHugs(h => h - 1);
      setHasHugged(false);
      localStorage.setItem('likedPosts', JSON.stringify(liked.filter(id => id !== post.id)));
    } else {
      setHugs(h => h + 1);
      setHasHugged(true);
      setHugAnimating(true);
      localStorage.setItem('likedPosts', JSON.stringify([...liked, post.id]));
      setTimeout(() => setHugAnimating(false), 300);
    }
  };

  const handleRelated = () => {
    let relatedArr = [];
    try { relatedArr = safeJSONParse(localStorage.getItem('relatedPosts'), []); } catch {}
    
    if (hasRelated) {
      setRelated(r => r - 1);
      setHasRelated(false);
      localStorage.setItem('relatedPosts', JSON.stringify(relatedArr.filter(id => id !== post.id)));
    } else {
      setRelated(r => r + 1);
      setHasRelated(true);
      setRelatedAnimating(true);
      localStorage.setItem('relatedPosts', JSON.stringify([...relatedArr, post.id]));
      setTimeout(() => setRelatedAnimating(false), 300);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AppleEmoji emoji={post.avatar} size={28} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.875rem' }}>{post.author}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{post.time}</div>
          </div>
        </div>

        {post.isMine && !isEditing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setIsEditing(true)} style={{ color: 'var(--text-light)', background: 'transparent', cursor: 'pointer' }}>
              <Edit3 size={18} />
            </button>
            <button onClick={() => deletePost(post.id)} style={{ color: 'var(--accent-rose)', background: 'transparent', cursor: 'pointer' }}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      {!showSensitive && !isEditing ? (
        <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', margin: '0.5rem 0' }}>
          <EyeOff color="var(--text-light)" size={24} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-muted)' }}>Contenido Sensible</p>
          <button onClick={() => setShowSensitive(true)} style={{ marginTop: '0.75rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 800, padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            Ver contenido
          </button>
        </div>
      ) : isEditing ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical' }}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={() => { setIsEditing(false); setEditText(post.text); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800 }}>
              Cancelar
            </button>
            <button onClick={() => { updatePost(post.id, editText); setIsEditing(false); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={14} /> Guardar
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>{post.text}</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 800 }}>
          <button onClick={handleHug} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-rose)', backgroundColor: hasHugged ? 'var(--bg-danger)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => !hasHugged && (e.currentTarget.style.backgroundColor = 'var(--bg-danger)')} onMouseLeave={(e) => !hasHugged && (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Heart size={16} fill={hasHugged ? "var(--accent-rose)" : "none"} color="var(--accent-rose)" className={hugAnimating ? 'animate-pop' : ''} /> {hugs} Abrazos
          </button>
          <button onClick={handleRelated} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', backgroundColor: hasRelated ? 'var(--primary-light)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => !hasRelated && (e.currentTarget.style.backgroundColor = 'var(--primary-light)')} onMouseLeave={(e) => !hasRelated && (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Sparkles size={16} fill={hasRelated ? "var(--primary)" : "none"} color="var(--primary)" className={relatedAnimating ? 'animate-pop' : ''} /> {related} Me pasa igual
          </button>
        </div>
      </div>
    </div>
  );
}
