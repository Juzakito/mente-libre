/**
 * Account Registry Service
 * ========================
 * Centralized service to check email and pseudonym (nickname) uniqueness
 * across registered accounts in localStorage and Supabase.
 */

import { safeJSONParse } from '../utils/helpers';
import { supabase } from '../services/supabase/client';

const REGISTRY_STORAGE_KEY = 'mente-libre-registered-accounts';
const ACTIVE_USER_KEY = 'mente-libre-user';

// Seed initial default accounts if registry is empty
const INITIAL_DEFAULT_ACCOUNTS = [
  { id: 'user_josh', email: 'josh@gmail.com', nickname: 'Josh', avatar: '🦊', career: 'Ingeniería de Sistemas', onboarding_completed: true },
  { id: 'user_buho', email: 'buho@gmail.com', nickname: 'Búho_Uni', avatar: '🦉', career: 'Medicina Humana', onboarding_completed: true },
  { id: 'user_jay', email: 'flyingjay@gmail.com', nickname: 'FlyingJay_99', avatar: '🦊', career: 'Ingeniería de Sistemas', onboarding_completed: true },
  { id: 'user_anxious', email: 'anxious@gmail.com', nickname: 'Anxious_Soul', avatar: '👽', career: 'Psicología', onboarding_completed: true }
];

export function getRegisteredAccounts() {
  let accounts = safeJSONParse(localStorage.getItem(REGISTRY_STORAGE_KEY), null);
  if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
    accounts = [...INITIAL_DEFAULT_ACCOUNTS];
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(accounts));
  }

  // Always include active user if present
  const currentUser = safeJSONParse(localStorage.getItem(ACTIVE_USER_KEY), null);
  if (currentUser?.nickname && currentUser?.email) {
    const exists = accounts.some(
      (a) => a.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
             a.nickname?.toLowerCase() === currentUser.nickname?.toLowerCase()
    );
    if (!exists) {
      accounts.push(currentUser);
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(accounts));
    }
  }

  return accounts;
}

/**
  * Check if an email is already registered (case-insensitive)
  */
export async function isEmailRegistered(email) {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  
  const accounts = getRegisteredAccounts();
  const localExists = accounts.some((a) => a.email?.trim().toLowerCase() === cleanEmail);
  if (localExists) return true;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (!error && data) return true;
    } catch {}
  }

  return false;
}

/**
  * Check if a pseudonym/nickname is already registered (case-insensitive), excluding current user
  */
export async function isNicknameRegistered(nickname, excludeUserId = null) {
  if (!nickname) return false;
  const cleanNick = nickname.trim().toLowerCase();

  const accounts = getRegisteredAccounts();
  const localExists = accounts.some(
    (a) => a.nickname?.trim().toLowerCase() === cleanNick && a.id !== excludeUserId
  );
  if (localExists) return true;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .ilike('full_name', cleanNick)
        .maybeSingle();
      if (!error && data && data.id !== excludeUserId) return true;
    } catch {}
  }

  return false;
}

/**
  * Find existing account by email OR pseudonym/nickname
  */
export async function findAccountByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  const accounts = getRegisteredAccounts();
  const foundLocal = accounts.find(
    (a) => a.email?.trim().toLowerCase() === clean || a.nickname?.trim().toLowerCase() === clean
  );
  if (foundLocal) return foundLocal;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.${clean},full_name.ilike.${clean}`)
        .maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          email: data.email || `${clean}@gmail.com`,
          nickname: data.full_name || clean,
          avatar: data.avatar_url || '🦊',
          career: data.career || 'Estudiante Universitario',
          onboarding_completed: true
        };
      }
    } catch {}
  }

  return null;
}

/**
  * Register a new account into the registry
  */
export function registerAccount(accountData) {
  const accounts = getRegisteredAccounts();
  const cleanEmail = accountData.email?.trim().toLowerCase();
  const cleanNick = accountData.nickname?.trim();

  const existingIndex = accounts.findIndex(
    (a) => (cleanEmail && a.email?.trim().toLowerCase() === cleanEmail) ||
           (cleanNick && a.nickname?.trim().toLowerCase() === cleanNick.toLowerCase())
  );

  const newAcc = {
    id: accountData.id || 'user_' + Date.now(),
    email: cleanEmail,
    nickname: cleanNick,
    avatar: accountData.avatar || '🦊',
    career: accountData.career || 'Estudiante Universitario',
    onboarding_completed: true,
    created_at: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    accounts[existingIndex] = { ...accounts[existingIndex], ...newAcc };
  } else {
    accounts.push(newAcc);
  }

  localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(accounts));
  return newAcc;
}

/**
  * Update an existing account in registry
  */
export function updateAccountInRegistry(userId, newNickname, newAvatar, newCareer) {
  const accounts = getRegisteredAccounts();
  const idx = accounts.findIndex((a) => a.id === userId || a.nickname === newNickname);
  if (idx >= 0) {
    accounts[idx] = {
      ...accounts[idx],
      nickname: newNickname,
      avatar: newAvatar,
      career: newCareer,
      full_name: newNickname,
      avatar_url: newAvatar
    };
  } else {
    accounts.push({
      id: userId || 'user_' + Date.now(),
      nickname: newNickname,
      avatar: newAvatar,
      career: newCareer,
      onboarding_completed: true
    });
  }
  localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(accounts));
}
