import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useOutletContext } from 'react-router-dom';

export default function PomodoroTimer() {
  const modes = [
    { id: 'pomodoro', label: 'Pomodoro', duration: 25 * 60 },
    { id: 'short', label: 'Corto', duration: 5 * 60 },
    { id: 'long', label: 'Largo', duration: 15 * 60 },
  ];

  const [activeMode, setActiveMode] = useState(modes[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.duration);
  const [isActive, setIsActive] = useState(false);
  const { awardPoints } = useAppContext();
  const outletCtx = useOutletContext();
  const showToast = outletCtx?.showToast || console.log;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      // Give points based on mode length
      let pointsToAward = 10;
      if (activeMode.id === 'pomodoro') pointsToAward = 25;
      else if (activeMode.id === 'long') pointsToAward = 15;
      
      awardPoints(pointsToAward);
      showToast(`¡Sesión terminada! Has ganado +${pointsToAward} pts 🍅`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, activeMode, awardPoints, showToast]);

  useEffect(() => {
    setTimeLeft(activeMode.duration);
    setIsActive(false);
  }, [activeMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(activeMode.duration);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', width: '100%', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode)}
            style={{
              flex: '1 0 auto',
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeMode.id === mode.id ? 'var(--accent-rose)' : 'transparent',
              color: activeMode.id === mode.id ? 'white' : 'var(--text-main)',
              border: 'none',
              transition: 'all 0.2s',
              boxShadow: activeMode.id === mode.id ? '0 4px 10px rgba(244, 63, 94, 0.3)' : 'none'
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        {isActive && <div className="animate-pulse" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>}
        
        <div style={{ 
          width: '100%', height: '100%', 
          borderRadius: '50%', 
          border: '4px solid var(--accent-rose)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(244, 63, 94, 0.2), inset 0 0 20px rgba(244, 63, 94, 0.2)',
          background: 'var(--surface)',
          zIndex: 1
        }}>
          <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {minutes}:{seconds}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {activeMode.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <button 
          onClick={resetTimer}
          style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor='var(--bg-color)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor='var(--surface)'}
        >
          Reiniciar
        </button>
        <button 
          onClick={toggleTimer}
          style={{ flex: 2, padding: '1rem', backgroundColor: isActive ? 'var(--surface)' : 'var(--accent-rose)', color: isActive ? 'var(--text-main)' : 'white', border: isActive ? '1px solid var(--border-color)' : 'none', borderRadius: 'var(--radius-full)', fontWeight: 800, cursor: 'pointer', boxShadow: isActive ? 'none' : '0 8px 16px rgba(244, 63, 94, 0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onMouseOver={e => !isActive && (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseOut={e => !isActive && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} fill="white" />} 
          {isActive ? 'Pausar' : 'Empezar'}
        </button>
      </div>

    </div>
  );
}
