import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Minimize2, Music } from 'lucide-react';
import Draggable from 'react-draggable';
import { useAudio } from '../../store/AudioContext';

export default function GlobalAudioPlayer() {
  const { 
    globalAudioTrack, setGlobalAudioTrack,
    globalAudioIsPlaying, setGlobalAudioIsPlaying,
    globalAudioVolume, setGlobalAudioVolume,
    globalAudioIsMuted, setGlobalAudioIsMuted
  } = useAudio();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      const adjustedVolume = 1 - Math.pow(1 - globalAudioVolume, 3);
      audioRef.current.volume = globalAudioIsMuted ? 0 : adjustedVolume;
    }
  }, [globalAudioVolume, globalAudioIsMuted, globalAudioTrack]);

  // Sync play state if track changes
  useEffect(() => {
    if (globalAudioTrack) {
      setGlobalAudioIsPlaying(true);
    }
  }, [globalAudioTrack, setGlobalAudioIsPlaying]);

  // Handle Play/Pause programmatic toggling
  useEffect(() => {
    if (audioRef.current) {
      if (globalAudioIsPlaying) {
        audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [globalAudioIsPlaying, globalAudioTrack]);

  if (!globalAudioTrack) return null;

  const togglePlay = () => setGlobalAudioIsPlaying(!globalAudioIsPlaying);
  const closePlayer = () => {
    setGlobalAudioIsPlaying(false);
    setGlobalAudioTrack(null);
  };

  return (
    <Draggable bounds="body" cancel="button, input[type='range']">
      <div className={`global-player-container ${isMinimized ? 'minimized' : ''}`}>
      {isMinimized ? (
        <div 
          className="global-player glass" 
          onClick={() => setIsMinimized(false)}
          style={{
            pointerEvents: 'auto',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--border-color)', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)'
          }}
        >
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(13,148,136,0.3)' }}>
            {globalAudioIsPlaying ? (
              <span className="animate-pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={18} />
              </span>
            ) : (
              <Music size={18} />
            )}
          </div>
        </div>
      ) : (
        <div className="global-player glass" style={{
          width: '100%',
          maxWidth: '400px',
          pointerEvents: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.75rem 1rem', 
          borderRadius: 'var(--radius-full)', 
          border: '1px solid var(--border-color)', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'var(--surface)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
            <button 
              onClick={togglePlay} 
              style={{ 
                width: '2.5rem', 
                height: '2.5rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: 'none', 
                cursor: 'pointer', 
                boxShadow: '0 4px 10px rgba(13,148,136,0.3)', 
                transition: 'transform 0.1s',
                flexShrink: 0
              }} 
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} 
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {globalAudioIsPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" style={{ marginLeft: '2px' }} />}
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {globalAudioIsPlaying && <span className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-rose)', display: 'inline-block' }}></span>}
                {globalAudioTrack.mood.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {globalAudioTrack.title}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <button 
              onClick={() => setGlobalAudioIsMuted(!globalAudioIsMuted)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              {globalAudioIsMuted || globalAudioVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={globalAudioIsMuted ? 0 : globalAudioVolume} 
              onChange={(e) => { setGlobalAudioVolume(parseFloat(e.target.value)); setGlobalAudioIsMuted(false); }}
              className="premium-slider"
              style={{ 
                width: '60px', 
                cursor: 'pointer',
                background: `linear-gradient(to right, var(--primary) ${(globalAudioIsMuted ? 0 : globalAudioVolume) * 100}%, var(--border-color) ${(globalAudioIsMuted ? 0 : globalAudioVolume) * 100}%)`,
                marginRight: '0.25rem'
              }}
            />
            
            <button 
              onClick={() => setIsMinimized(true)} 
              style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '50%' }}
              title="Minimizar reproductor"
            >
              <Minimize2 size={14} />
            </button>
            <button 
              onClick={closePlayer} 
              style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '50%', marginLeft: '2px' }}
              title="Cerrar reproductor"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      <audio 
        ref={audioRef}
        key={globalAudioTrack.id}
        src={globalAudioTrack.url}
        onPlay={() => setGlobalAudioIsPlaying(true)}
        onPause={() => setGlobalAudioIsPlaying(false)}
        loop
        style={{ display: 'none' }}
      ></audio>
      </div>
    </Draggable>
  );
}
