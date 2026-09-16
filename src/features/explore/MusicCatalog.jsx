import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppleEmoji from '../../components/ui/AppleEmoji';
import { Play, Pause, Headphones, Cloud, Moon, Zap } from 'lucide-react';
import { useAudio } from '../../store/AudioContext';

export default function MusicCatalog() {
  const { t } = useTranslation();
  const tracks = [
    { id: 1, title: 'Lo-Fi Study Focus', mood: 'Enfoque', url: 'https://ice1.somafm.com/groovesalad-128-mp3', icon: Headphones },
    { id: 2, title: 'Ambient Chillout', mood: 'Relajación', url: 'https://ice1.somafm.com/spacestation-128-mp3', icon: Cloud },
    { id: 3, title: 'Deep Sleep Meditation', mood: 'Dormir', url: 'https://ice1.somafm.com/dronezone-128-mp3', icon: Moon },
    { id: 4, title: 'Upbeat Energy Workout', mood: 'Energía', url: 'https://ice1.somafm.com/beatblender-128-mp3', icon: Zap },
  ];
  const { globalAudioTrack, setGlobalAudioTrack, globalAudioIsPlaying, setGlobalAudioIsPlaying } = useAudio();
  const [activeMood, setActiveMood] = useState('Todos');

  const moods = ['Todos', ...new Set(tracks.map(t => t.mood))];
  const filteredTracks = activeMood === 'Todos' ? tracks : tracks.filter(t => t.mood === activeMood);

  const handleTrackClick = (track) => {
    if (globalAudioTrack?.id === track.id) {
      setGlobalAudioIsPlaying(!globalAudioIsPlaying);
    } else {
      setGlobalAudioTrack(track);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('explore.musicDesc')}</p>
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {moods.map(mood => (
          <button
            key={mood}
            onClick={() => setActiveMood(mood)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              backgroundColor: activeMood === mood ? 'var(--primary)' : 'var(--bg-color)',
              color: activeMood === mood ? 'white' : 'var(--text-main)',
              border: activeMood === mood ? 'none' : '1px solid var(--border-color)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {mood}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
        {filteredTracks.map(track => {
          const isCurrentlyPlaying = globalAudioTrack?.id === track.id && globalAudioIsPlaying;
          return (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              style={{
                backgroundColor: globalAudioTrack?.id === track.id ? 'var(--primary-light)' : 'var(--bg-color)',
                border: `1px solid ${globalAudioTrack?.id === track.id ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (globalAudioTrack?.id !== track.id) e.currentTarget.style.borderColor = 'var(--text-light)';
              }}
              onMouseOut={(e) => {
                if (globalAudioTrack?.id !== track.id) e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', color: globalAudioTrack?.id === track.id ? 'var(--primary)' : 'var(--text-main)', transition: 'color 0.2s ease' }}><track.icon size={40} strokeWidth={1.5} /></div>
              <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>{track.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{track.mood}</div>
              <button style={{
                marginTop: '0.5rem',
                backgroundColor: isCurrentlyPlaying ? 'var(--primary)' : 'var(--surface)',
                color: isCurrentlyPlaying ? 'white' : 'var(--text-main)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCurrentlyPlaying ? '0 4px 10px rgba(13,148,136,0.3)' : 'none'
              }}>
                {isCurrentlyPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill={isCurrentlyPlaying ? "white" : "none"} style={{ marginLeft: '2px' }} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
