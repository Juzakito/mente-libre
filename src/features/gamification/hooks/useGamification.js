/**
 * useGamification Hook
 * =====================
 * Manages all gamification state: feathers (currency), points,
 * streaks, badges, unlockable avatars, and wellness challenges.
 *
 * Syncs state bidirectionally between localStorage and Supabase
 * user metadata with debounced cloud saves.
 *
 * Usage:
 *   const { feathers, points, streak, badges, addFeathers, awardPoints, ... } = useGamification();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../services/supabase/client';
import { useAuth } from '../../../store/AuthContext';
import { safeJSONParse } from '../../../utils/helpers';

// ─── Storage Keys ─────────────────────────────────────────
const KEYS = {
  FEATHERS: 'mente-libre-feathers',
  AVATARS: 'mente-libre-avatars',
  POINTS: 'mente-libre-points',
  STREAK: 'mente-libre-streak',
  LAST_ACTIVE: 'mente-libre-last-active',
  BADGES: 'mente-libre-badges',
  MOODS: 'mente-libre-moods',
  CHALLENGES: 'wellness_challenges',
  AI_ASSISTANT: 'mente-libre-ai-assistant',
  PRIVACY_REPLIES: 'mente-libre-privacy-replies',
  FOUNDER_CREDIT: 'mente-libre-founder-auto-1000',
};

export function useGamification() {
  const { user } = useAuth();

  // ─── Feathers (currency) ────────────────────────────────
  const [feathers, setFeathers] = useState(() => {
    const saved = localStorage.getItem(KEYS.FEATHERS);
    let current = parseInt(saved || '0', 10);
    const alreadyCredited = localStorage.getItem(KEYS.FOUNDER_CREDIT);
    if (!alreadyCredited) {
      localStorage.setItem(KEYS.FOUNDER_CREDIT, 'true');
      current = current < 1000 ? current + 1000 : current;
      localStorage.setItem(KEYS.FEATHERS, current.toString());
    }
    return current;
  });

  // ─── Unlocked Avatars ───────────────────────────────────
  const [unlockedAvatars, setUnlockedAvatars] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.AVATARS), ['🦉'])
  );

  // ─── Points ─────────────────────────────────────────────
  const [gamificationPoints, setGamificationPoints] = useState(() => {
    const saved = localStorage.getItem(KEYS.POINTS);
    return saved ? parseInt(saved, 10) : 0;
  });

  // ─── Streak ─────────────────────────────────────────────
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem(KEYS.STREAK);
    const oldSaved = localStorage.getItem('mente_libre_streak');
    return saved ? parseInt(saved, 10) : oldSaved ? parseInt(oldSaved, 10) : 0;
  });

  const [lastActiveDate, setLastActiveDate] = useState(() => {
    const savedDate = localStorage.getItem(KEYS.LAST_ACTIVE);
    const oldLoginDate = localStorage.getItem('mente_libre_last_login');
    if (!savedDate && oldLoginDate) {
      try {
        return new Date(oldLoginDate).toISOString().split('T')[0];
      } catch {
        return null;
      }
    }
    return savedDate || null;
  });

  // ─── Badges ─────────────────────────────────────────────
  const [unlockedBadges, setUnlockedBadges] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.BADGES), [])
  );

  // ─── Moods ──────────────────────────────────────────────
  const [moods, setMoods] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.MOODS), [])
  );

  // ─── Wellness Challenges ────────────────────────────────
  const [wellnessChallenges, setWellnessChallenges] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.CHALLENGES), {
      cycle: 0,
      challenges: [],
    })
  );

  // ─── Preferences ───────────────────────────────────────
  const [showAIAssistant, setShowAIAssistant] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.AI_ASSISTANT), true)
  );

  const [showRepliesOnProfile, setShowRepliesOnProfile] = useState(() =>
    safeJSONParse(localStorage.getItem(KEYS.PRIVACY_REPLIES), false)
  );

  // ─── Appointments ──────────────────────────────────────
  const [appointments, setAppointments] = useState(() =>
    safeJSONParse(localStorage.getItem('mente-libre-appointments'), [])
  );

  // ─── Persist to localStorage ────────────────────────────
  useEffect(() => {
    localStorage.setItem(KEYS.FEATHERS, feathers.toString());
  }, [feathers]);

  useEffect(() => {
    localStorage.setItem(KEYS.AVATARS, JSON.stringify(unlockedAvatars));
  }, [unlockedAvatars]);

  useEffect(() => {
    localStorage.setItem(KEYS.POINTS, gamificationPoints.toString());
  }, [gamificationPoints]);

  useEffect(() => {
    localStorage.setItem(KEYS.STREAK, streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastActiveDate) localStorage.setItem(KEYS.LAST_ACTIVE, lastActiveDate);
  }, [lastActiveDate]);

  useEffect(() => {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(wellnessChallenges));
  }, [wellnessChallenges]);

  // ─── Sync to Supabase (debounced) ──────────────────────
  useEffect(() => {
    if (supabase && user) {
      const timeoutId = setTimeout(() => {
        supabase.auth
          .updateUser({
            data: {
              feathers,
              unlockedAvatars,
              gamificationPoints,
              unlockedBadges,
              streak,
              showRepliesOnProfile,
              showAIAssistant,
              nickname: user.nickname,
              avatar: user.avatar,
              career: user.career,
              moods: moods.slice(0, 100),
              wellnessChallenges,
            },
          })
          .catch((err) =>
            console.error('Error saving gamification state:', err)
          );
        localStorage.setItem(
          KEYS.PRIVACY_REPLIES,
          JSON.stringify(showRepliesOnProfile)
        );
        localStorage.setItem(
          KEYS.AI_ASSISTANT,
          JSON.stringify(showAIAssistant)
        );
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [
    feathers,
    unlockedAvatars,
    gamificationPoints,
    unlockedBadges,
    streak,
    showRepliesOnProfile,
    showAIAssistant,
    user,
    moods,
    wellnessChallenges,
  ]);

  // ─── Hydrate from cloud on auth ─────────────────────────
  useEffect(() => {
    if (!supabase || !user) return;

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser?.user_metadata) {
        const meta = authUser.user_metadata;
        if (meta.feathers !== undefined) setFeathers(meta.feathers);
        if (meta.unlockedAvatars) {
          const localAvatars = safeJSONParse(
            localStorage.getItem(KEYS.AVATARS),
            ['🦉']
          );
          setUnlockedAvatars(
            Array.from(
              new Set([
                ...localAvatars,
                ...(Array.isArray(meta.unlockedAvatars)
                  ? meta.unlockedAvatars
                  : []),
              ])
            )
          );
        }
        if (meta.gamificationPoints !== undefined) {
          const localPoints = parseInt(
            localStorage.getItem(KEYS.POINTS) || '0',
            10
          );
          setGamificationPoints(Math.max(localPoints, meta.gamificationPoints));
        }
        if (meta.unlockedBadges) {
          const localBadges = safeJSONParse(
            localStorage.getItem(KEYS.BADGES),
            []
          );
          setUnlockedBadges(
            Array.from(
              new Set([
                ...localBadges,
                ...(Array.isArray(meta.unlockedBadges)
                  ? meta.unlockedBadges
                  : []),
              ])
            )
          );
        }
        if (meta.streak !== undefined) {
          const localStreak = parseInt(
            localStorage.getItem(KEYS.STREAK) || '0',
            10
          );
          setStreak(Math.max(localStreak, meta.streak));
        }
        if (meta.moods) {
          const localMoods = safeJSONParse(
            localStorage.getItem(KEYS.MOODS),
            []
          );
          const mergedMoods = [
            ...localMoods,
            ...(Array.isArray(meta.moods) ? meta.moods : []),
          ]
            .reduce((acc, current) => {
              if (!acc.find((item) => item.id === current.id)) {
                acc.push(current);
              }
              return acc;
            }, [])
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setMoods(mergedMoods);
        }
        if (meta.wellnessChallenges) {
          const localChallenges = safeJSONParse(
            localStorage.getItem(KEYS.CHALLENGES),
            { cycle: 0, challenges: [] }
          );
          if (meta.wellnessChallenges.cycle >= localChallenges.cycle) {
            setWellnessChallenges(meta.wellnessChallenges);
          }
        }
        if (meta.showAIAssistant !== undefined)
          setShowAIAssistant(meta.showAIAssistant);
        if (meta.showRepliesOnProfile !== undefined)
          setShowRepliesOnProfile(meta.showRepliesOnProfile);
      }
    });
  }, [user?.id]);

  // ─── Actions ────────────────────────────────────────────
  const addFeathers = useCallback((amount) => {
    setFeathers((prev) => prev + amount);
  }, []);

  const unlockAvatar = useCallback(
    (avatarEmoji, cost) => {
      if (feathers >= cost && !unlockedAvatars.includes(avatarEmoji)) {
        setFeathers((prev) => prev - cost);
        setUnlockedAvatars((prev) => [...prev, avatarEmoji]);
        return true;
      }
      return false;
    },
    [feathers, unlockedAvatars]
  );

  const awardPoints = useCallback(
    (amount) => {
      setGamificationPoints((prev) => {
        const newPoints = prev + amount;
        const newBadges = [];
        if (newPoints >= 100 && !unlockedBadges.includes('pomodoro_master'))
          newBadges.push('pomodoro_master');
        if (newPoints >= 500 && !unlockedBadges.includes('mental_guru'))
          newBadges.push('mental_guru');
        if (newBadges.length > 0) {
          setUnlockedBadges((current) => [...current, ...newBadges]);
        }
        return newPoints;
      });
    },
    [unlockedBadges]
  );

  const checkAndIncrementStreak = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    if (!lastActiveDate) {
      setStreak(1);
      setLastActiveDate(todayStr);
      if (!unlockedBadges.includes('first_step'))
        setUnlockedBadges((c) => [...c, 'first_step']);
      return true;
    }

    if (lastActiveDate === todayStr) return false;

    const lastDate = new Date(lastActiveDate);
    const todayDate = new Date(todayStr);
    const diffDays = Math.ceil(
      Math.abs(todayDate - lastDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastActiveDate(todayStr);
      if (newStreak >= 3 && !unlockedBadges.includes('streak_3'))
        setUnlockedBadges((c) => [...c, 'streak_3']);
      if (newStreak >= 7 && !unlockedBadges.includes('streak_7'))
        setUnlockedBadges((c) => [...c, 'streak_7']);
      return true;
    } else if (diffDays > 1) {
      setStreak(1);
      setLastActiveDate(todayStr);
      return true;
    }

    return false;
  }, [lastActiveDate, streak, unlockedBadges]);

  // Auto-check streak on user login
  useEffect(() => {
    if (user) {
      checkAndIncrementStreak();
    }
  }, [user?.id]);

  // ─── Mood Actions ──────────────────────────────────────
  const addMood = useCallback(
    async (moodEntry) => {
      const valueMap = {
        Increíble: 5,
        Bien: 4,
        Regular: 3,
        Triste: 2,
        Abrumado: 1,
      };
      const score = valueMap[moodEntry.mood?.label] || 3;

      if (supabase && user) {
        try {
          await supabase.from('moods').insert([
            {
              user_id: user.id,
              mood_score: score,
              notes: moodEntry.note || null,
              university_id:
                user.university_id ||
                '00000000-0000-0000-0000-000000000001',
            },
          ]);
        } catch (err) {
          console.error('Error adding mood to Supabase:', err);
        }
      }

      setMoods((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [moodEntry, ...safePrev].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });
    },
    [user]
  );

  const updateMood = useCallback((id, newNote, newMoodObj) => {
    setMoods((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((m) =>
        m.id === id
          ? {
              ...m,
              note: newNote !== undefined ? newNote : m.note,
              mood: newMoodObj !== undefined ? newMoodObj : m.mood,
            }
          : m
      );
    });
  }, []);

  const deleteMood = useCallback((id) => {
    setMoods((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((m) => m.id !== id);
    });
  }, []);

  // ─── Preference Toggles ────────────────────────────────
  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant((prev) => {
      const newVal = !prev;
      localStorage.setItem(KEYS.AI_ASSISTANT, JSON.stringify(newVal));
      return newVal;
    });
  }, []);

  const toggleShowRepliesOnProfile = useCallback(() => {
    setShowRepliesOnProfile((prev) => {
      const newVal = !prev;
      localStorage.setItem(KEYS.PRIVACY_REPLIES, JSON.stringify(newVal));
      return newVal;
    });
  }, []);

  // ─── Appointments ──────────────────────────────────────
  const addAppointment = useCallback((expert, date, time) => {
    const newAppointment = {
      id: Date.now().toString(),
      expert,
      date: date.toISOString(),
      time,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => {
      const updated = [newAppointment, ...prev];
      localStorage.setItem(
        'mente-libre-appointments',
        JSON.stringify(updated)
      );
      return updated;
    });
  }, []);

  return {
    // Currency
    feathers,
    addFeathers,
    unlockedAvatars,
    unlockAvatar,

    // Points & Streak
    gamificationPoints,
    awardPoints,
    streak,
    checkAndIncrementStreak,
    unlockedBadges,

    // Moods
    moods,
    addMood,
    updateMood,
    deleteMood,

    // Wellness
    wellnessChallenges,
    setWellnessChallenges,

    // Preferences
    showAIAssistant,
    toggleAIAssistant,
    showRepliesOnProfile,
    toggleShowRepliesOnProfile,

    // Appointments
    appointments,
    addAppointment,
  };
}
