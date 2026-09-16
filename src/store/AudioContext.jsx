/**
 * Audio Context
 * ==============
 * Manages global audio playback state for ambient/wellness audio.
 * Isolated from other state to prevent audio state changes
 * from causing re-renders in unrelated components.
 */

import React, { createContext, useState, useContext, useCallback } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [globalAudioTrack, setGlobalAudioTrack] = useState(null);
  const [globalAudioIsPlaying, setGlobalAudioIsPlaying] = useState(false);
  const [globalAudioVolume, setGlobalAudioVolume] = useState(0.8);
  const [globalAudioIsMuted, setGlobalAudioIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setGlobalAudioIsMuted((prev) => !prev);
  }, []);

  const stopAudio = useCallback(() => {
    setGlobalAudioTrack(null);
    setGlobalAudioIsPlaying(false);
  }, []);

  const value = React.useMemo(
    () => ({
      globalAudioTrack,
      setGlobalAudioTrack,
      globalAudioIsPlaying,
      setGlobalAudioIsPlaying,
      globalAudioVolume,
      setGlobalAudioVolume,
      globalAudioIsMuted,
      setGlobalAudioIsMuted,
      toggleMute,
      stopAudio,
    }),
    [
      globalAudioTrack,
      globalAudioIsPlaying,
      globalAudioVolume,
      globalAudioIsMuted,
      toggleMute,
      stopAudio,
    ]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

/**
 * Hook to access global audio state.
 * Must be used within an AudioProvider.
 */
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
