/**
 * AppContext (Enterprise Adapter / Compatibility Layer)
 * =======================================================
 * Bridges the legacy monolithic AppContext with the new modular store:
 * - AuthContext (src/store/AuthContext.jsx)
 * - ThemeContext (src/store/ThemeContext.jsx)
 * - AudioContext (src/store/AudioContext.jsx)
 * - NotificationContext (src/store/NotificationContext.jsx)
 * - usePosts (src/features/feed/hooks/usePosts.js)
 * - useGamification (src/features/gamification/hooks/useGamification.js)
 *
 * Guarantees 100% backward compatibility for all existing components
 * while allowing progressive migration to specialized hooks.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { ThemeProvider, useTheme } from '../store/ThemeContext';
import { AudioProvider, useAudio } from '../store/AudioContext';
import { NotificationProvider, useNotification } from '../store/NotificationContext';
import { usePosts } from '../features/feed/hooks/usePosts';
import { useGamification } from '../features/gamification/hooks/useGamification';

const AppContext = createContext(null);

const AppContextBridge = ({ children }) => {
  const auth = useAuth();
  const theme = useTheme();
  const audio = useAudio();
  const notification = useNotification();
  const posts = usePosts();
  const gamification = useGamification();

  const value = useMemo(
    () => ({
      // ─── Auth ──────────────────────────────────────────
      user: auth.user,
      setUser: auth.setUser,
      session: auth.session,
      isAuthLoading: auth.isAuthLoading,
      updateProfile: auth.updateProfile,
      logout: auth.logout,

      // ─── Theme ─────────────────────────────────────────
      theme: theme.theme,
      toggleTheme: theme.toggleTheme,
      isDark: theme.isDark,

      // ─── Audio ─────────────────────────────────────────
      globalAudioTrack: audio.globalAudioTrack,
      setGlobalAudioTrack: audio.setGlobalAudioTrack,
      globalAudioIsPlaying: audio.globalAudioIsPlaying,
      setGlobalAudioIsPlaying: audio.setGlobalAudioIsPlaying,
      globalAudioVolume: audio.globalAudioVolume,
      setGlobalAudioVolume: audio.setGlobalAudioVolume,
      globalAudioIsMuted: audio.globalAudioIsMuted,
      setGlobalAudioIsMuted: audio.setGlobalAudioIsMuted,
      toggleMute: audio.toggleMute,
      stopAudio: audio.stopAudio,

      // ─── Notifications (Toasts) ────────────────────────
      notifications: notification.notifications,
      addNotification: notification.addNotification,
      removeNotification: notification.removeNotification,
      notifySuccess: notification.notifySuccess,
      notifyError: notification.notifyError,
      notifyWarning: notification.notifyWarning,
      notifyInfo: notification.notifyInfo,

      // ─── Posts & Comments ──────────────────────────────
      posts: posts.posts,
      loadingPosts: posts.loadingPosts,
      addPost: posts.addPost,
      deletePost: posts.deletePost,
      updatePost: posts.updatePost,
      toggleHug: posts.toggleHug,
      addComment: posts.addComment,
      deleteComment: posts.deleteComment,
      updateComment: posts.updateComment,
      toggleCommentHug: posts.toggleCommentHug,
      refreshPosts: posts.refreshPosts,

      // ─── Gamification & Currency ───────────────────────
      feathers: gamification.feathers,
      addFeathers: gamification.addFeathers,
      unlockedAvatars: gamification.unlockedAvatars,
      unlockAvatar: gamification.unlockAvatar,
      gamificationPoints: gamification.gamificationPoints,
      awardPoints: gamification.awardPoints,
      streak: gamification.streak,
      checkAndIncrementStreak: gamification.checkAndIncrementStreak,
      unlockedBadges: gamification.unlockedBadges,

      // ─── Mood Tracking ─────────────────────────────────
      moods: gamification.moods,
      addMood: gamification.addMood,
      updateMood: gamification.updateMood,
      deleteMood: gamification.deleteMood,

      // ─── Wellness Challenges ───────────────────────────
      wellnessChallenges: gamification.wellnessChallenges,
      setWellnessChallenges: gamification.setWellnessChallenges,

      // ─── Preferences & Settings ────────────────────────
      showAIAssistant: gamification.showAIAssistant,
      toggleAIAssistant: gamification.toggleAIAssistant,
      showRepliesOnProfile: gamification.showRepliesOnProfile,
      toggleShowRepliesOnProfile: gamification.toggleShowRepliesOnProfile,

      // ─── Appointments ──────────────────────────────────
      appointments: gamification.appointments,
      addAppointment: gamification.addAppointment,
    }),
    [auth, theme, audio, notification, posts, gamification]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AudioProvider>
          <NotificationProvider>
            <AppContextBridge>{children}</AppContextBridge>
          </NotificationProvider>
        </AudioProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
