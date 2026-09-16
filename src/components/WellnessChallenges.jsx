import React, { useState, useEffect } from 'react';
import { Target, Award, Calendar, ChevronRight, Zap, CheckCircle2, Activity, Book, Droplet, ChevronDown, ChevronUp } from 'lucide-react';
import { useGamification } from '../features/gamification/hooks/useGamification';
import confetti from 'canvas-confetti';

function renderIcon(iconName, color) {
  const props = { size: 22, color, style: { filter: `drop-shadow(0 0 6px ${color}99)` } };
  switch (iconName) {
    case 'Zap':      return <Zap {...props} />;
    case 'Target':   return <Target {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Book':     return <Book {...props} />;
    case 'Droplet':  return <Droplet {...props} />;
    default:         return <Target {...props} />;
  }
}

const CHALLENGE_POOL = [
  { id: 1, title: "5 Días de Mindfulness", sponsor: "Bienestar Universitario", reward: "1 Botella Reutilizable", total: 5, color: "var(--accent-blue)", iconName: "Zap" },
  { id: 2, title: "Desconexión Digital", sponsor: "Centro de Estudiantes", reward: "Sorteo: Auriculares", total: 3, color: "var(--primary)", iconName: "Target" },
  { id: 3, title: "Caminata al Campus", sponsor: "Deportes UAM", reward: "Camiseta Deportiva", total: 4, color: "var(--accent-orange)", iconName: "Activity" },
  { id: 4, title: "Lectura Consciente", sponsor: "Biblioteca Central", reward: "Libro Sorpresa", total: 5, color: "var(--accent-rose)", iconName: "Book" },
  { id: 5, title: "Hidratación Constante", sponsor: "Cafetería Central", reward: "1 Jugo Gratis", total: 5, color: "#0ea5e9", iconName: "Droplet" }
];

const CYCLE_DAYS = 5;

function getChallengesForCycle(cycleNumber) {
  const index1 = (cycleNumber * 2) % CHALLENGE_POOL.length;
  const index2 = (cycleNumber * 2 + 1) % CHALLENGE_POOL.length;
  return [
    { ...CHALLENGE_POOL[index1], progress: 0, completed: false, lastCheckIn: null },
    { ...CHALLENGE_POOL[index2], progress: 0, completed: false, lastCheckIn: null }
  ];
}

export default function WellnessChallenges() {
  const { wellnessChallenges, setWellnessChallenges } = useGamification();
  const [currentCycle, setCurrentCycle] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const challenges = wellnessChallenges?.challenges || [];

  useEffect(() => {
    const today = new Date();
    // Use GMT to keep cycles consistent regardless of local time
    const cycle = Math.floor(today.getTime() / (CYCLE_DAYS * 24 * 60 * 60 * 1000));
    setCurrentCycle(cycle);

    if (wellnessChallenges?.cycle === cycle) {
      // Valid cycle, do nothing
    } else {
      const newChallenges = getChallengesForCycle(cycle);
      
      const cycleStart = new Date(cycle * CYCLE_DAYS * 24 * 60 * 60 * 1000);
      const cycleEnd = new Date((cycle + 1) * CYCLE_DAYS * 24 * 60 * 60 * 1000 - 1000);
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const dateStr = `${cycleStart.getDate()} ${monthNames[cycleStart.getMonth()]} - ${cycleEnd.getDate()} ${monthNames[cycleEnd.getMonth()]}`;

      const initializedChallenges = newChallenges.map(c => ({...c, date: dateStr}));
      
      setWellnessChallenges({
        cycle: cycle,
        challenges: initializedChallenges
      });
    }
  }, [wellnessChallenges, setWellnessChallenges]);

  const handleCheckIn = (id) => {
    const todayStr = new Date().toDateString();
    
    const updatedChallenges = challenges.map(c => {
      if (c.id === id && c.progress < c.total) {
        const isNowCompleted = c.progress + 1 === c.total;
        
        if (isNowCompleted) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.5 },
            colors: [c.color, '#ffffff', '#fbbf24']
          });
        }
        
        return { 
          ...c, 
          progress: c.progress + 1, 
          completed: isNowCompleted,
          lastCheckIn: todayStr
        };
      }
      return c;
    });

    setWellnessChallenges({
      cycle: currentCycle,
      challenges: updatedChallenges
    });
  };

  if (challenges.length === 0) return null;

  return (
    <div style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 60%, transparent)', backdropFilter: 'blur(12px)', borderRadius: '24px', padding: '1.25rem', border: '1px solid color-mix(in srgb, var(--border-color) 40%, transparent)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div 
        onClick={() => setExpanded(!expanded)} 
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
            <Award size={22} color="var(--accent-orange)" style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))' }} /> Retos Rotativos
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Nuevos
            </span>
            <div style={{ color: 'var(--text-muted)' }}>
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
          Nuevos retos cada 5 días. Completa tus objetivos para ganar recompensas reales.
        </p>
      </div>

      {expanded && (
        <div className="animate-accordion-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transformOrigin: 'top' }}>
        {challenges.map(challenge => (
          <div key={challenge.id} style={{ backgroundColor: 'var(--bg-color)', borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}>
            
            {/* Background Gradient Accent */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: `radial-gradient(circle at center, color-mix(in srgb, ${challenge.color} 35%, transparent), transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: `color-mix(in srgb, ${challenge.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid color-mix(in srgb, ${challenge.color} 35%, transparent)`, flexShrink: 0 }}>
                    {renderIcon(challenge.iconName, challenge.color)}
                  </div>
                  <h4 style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>{challenge.title}</h4>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '3.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> Válido: {challenge.date}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <Award size={12} color="var(--accent-orange)" /> <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>{challenge.reward}</span> 
                    <span style={{ margin: '0 0.25rem', color: 'var(--border-color)' }}>•</span> 
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>Sponsor: {challenge.sponsor}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  <span>Progreso</span>
                  <span style={{ color: challenge.color }}>{challenge.progress} / {challenge.total} días</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)', borderRadius: 'var(--radius-full)', height: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                  <div 
                    style={{ 
                      backgroundColor: challenge.color, 
                      height: '100%', 
                      borderRadius: 'var(--radius-full)', 
                      width: `${(challenge.progress / challenge.total) * 100}%`,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 12px color-mix(in srgb, ${challenge.color} 80%, transparent)`
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '0.25rem' }}>
                {challenge.completed ? (
                  <button style={{ width: '100%', backgroundColor: 'color-mix(in srgb, #10b981 15%, transparent)', color: '#10b981', border: '1px solid color-mix(in srgb, #10b981 30%, transparent)', padding: '0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'default', textShadow: '0 0 8px rgba(16, 185, 129, 0.3)' }}>
                    <CheckCircle2 size={18} /> Recompensa Desbloqueada
                  </button>
                ) : (
                  <button 
                    onClick={() => handleCheckIn(challenge.id)}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: challenge.progress > 0 ? challenge.color : 'var(--surface)',
                      color: challenge.progress > 0 ? 'white' : 'var(--text-main)',
                      boxShadow: challenge.progress > 0 ? `0 4px 16px color-mix(in srgb, ${challenge.color} 40%, transparent)` : 'none',
                      border: challenge.progress > 0 ? 'none' : '1px solid var(--border-color)',
                      textShadow: challenge.progress > 0 ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    {challenge.progress > 0 ? 'Avanzar Reto' : 'Comenzar Reto'} <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
