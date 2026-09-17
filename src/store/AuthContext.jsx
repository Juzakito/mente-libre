/**
 * Authentication Context
 * =======================
 * Manages user authentication state, session management,
 * and profile operations via Supabase Auth.
 *
 * Responsibilities:
 * - User session lifecycle (sign in, sign out, session restore)
 * - User profile data (nickname, avatar, career)
 * - Auth loading state
 * - Profile sync between Auth metadata, public.users table, and localStorage
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import { supabase } from '../services/supabase/client';
import { safeJSONParse } from '../utils/helpers';

const AuthContext = createContext(null);

// ─── Constants ────────────────────────────────────────────
const STORAGE_KEY = 'mente-libre-user';

// ─── Helper: Build unified user object from multiple sources ──
function buildUserFromSession(authUser, dbData) {
  const local = safeJSONParse(localStorage.getItem(STORAGE_KEY), {});
  const meta = authUser?.user_metadata || {};
  const db = dbData || {};

  // Prioritize user's explicit custom saved pseudonym over email prefix
  let nickname = local?.nickname || meta.nickname || meta.full_name;
  if (!nickname || (nickname.includes('@') && db.full_name && !db.full_name.includes('@'))) {
    nickname = db.full_name;
  }
  if (!nickname || nickname.includes('@')) {
    nickname = authUser?.email?.split('@')[0] || 'Josh';
  }

  const avatar = local?.avatar || meta.avatar || db.avatar_url || '🦊';
  const career = local?.career || meta.career || db.career || 'Estudiante Universitario';

  return {
    id: authUser?.id || local?.id || 'user_local',
    email: authUser?.email || local?.email,
    nickname,
    avatar,
    career,
    full_name: nickname,
    avatar_url: avatar,
    university_id: db.university_id || local?.university_id || null,
    onboarding_completed: true,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeJSONParse(localStorage.getItem(STORAGE_KEY), null)
  );
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // ─── Session initialization & auth state listener ───────
  React.useEffect(() => {
    if (!supabase) {
      // Fallback for local testing without Supabase env vars
      const savedUser = localStorage.getItem(STORAGE_KEY);
      setUser(safeJSONParse(savedUser, null));
      setIsAuthLoading(false);
      return;
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        if (currentSession?.user) {
          supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single()
            .then(({ data, error }) => {
              const built = buildUserFromSession(
                currentSession.user,
                error ? null : data
              );
              setUser(built);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(built));
              setIsAuthLoading(false);
            })
            .catch(() => {
              const built = buildUserFromSession(currentSession.user, null);
              setUser(built);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(built));
              setIsAuthLoading(false);
            });
        } else {
          const savedUser = safeJSONParse(
            localStorage.getItem(STORAGE_KEY),
            null
          );
          setUser(savedUser || null);
          setIsAuthLoading(false);
        }
      })
      .catch((err) => {
        console.warn('getSession error:', err);
        const savedUser = safeJSONParse(
          localStorage.getItem(STORAGE_KEY),
          null
        );
        if (savedUser) setUser(savedUser);
        setIsAuthLoading(false);
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data, error }) => {
            setUser((prev) => {
              const built = buildUserFromSession(
                currentSession.user,
                error ? null : data
              );
              const merged = { ...(prev || {}), ...built };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              return merged;
            });
            setIsAuthLoading(false);
          })
          .catch(() => {
            setUser((prev) => {
              const built = buildUserFromSession(currentSession.user, null);
              const merged = { ...(prev || {}), ...built };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              return merged;
            });
            setIsAuthLoading(false);
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        setIsAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Persist user to localStorage ───────────────────────
  React.useEffect(() => {
    if (isAuthLoading) return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user, isAuthLoading]);

  // ─── Profile Update ─────────────────────────────────────
  const updateProfile = useCallback(
    async (newNickname, newAvatar, newCareer) => {
      const oldNickname = user?.nickname;
      const oldAvatar = user?.avatar;

      const newUserData = {
        ...user,
        nickname: newNickname,
        avatar: newAvatar,
        career: newCareer,
        full_name: newNickname,
        avatar_url: newAvatar,
      };
      setUser(newUserData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserData));

      if (supabase) {
        try {
          await supabase.auth.updateUser({
            data: { nickname: newNickname, avatar: newAvatar, career: newCareer },
          });

          // Sync to public.users table
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (currentSession?.user) {
            await supabase.from('users').upsert(
              {
                id: currentSession.user.id,
                full_name: newNickname,
                avatar_url: newAvatar,
                career: newCareer,
              },
              { onConflict: 'id' }
            );
          }

          // Update old posts and comments
          await supabase
            .from('posts')
            .update({ author: newNickname, avatar: newAvatar })
            .eq('author', oldNickname)
            .eq('avatar', oldAvatar);

          await supabase
            .from('comments')
            .update({ author: newNickname, avatar: newAvatar })
            .eq('author', oldNickname)
            .eq('avatar', oldAvatar);
        } catch (err) {
          console.error('Error updating profile in Supabase:', err);
        }
      }
    },
    [user]
  );

  // ─── Logout ─────────────────────────────────────────────
  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      session,
      isAuthLoading,
      updateProfile,
      logout,
    }),
    [user, session, isAuthLoading, updateProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication state.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
