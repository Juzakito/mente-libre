/**
 * Notification Context
 * =====================
 * Centralized toast/notification system.
 * Manages a queue of notifications with auto-dismiss.
 *
 * Usage:
 *   const { showToast, showError, showSuccess } = useNotification();
 *   showToast('Hello world');
 *   showSuccess('Post created!');
 *   showError('Something went wrong');
 */

import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

// ─── Constants ────────────────────────────────────────────
const DEFAULT_DURATION = 3000; // ms
const MAX_TOASTS = 3;

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 * @typedef {{ id: string, message: string, type: ToastType }} Toast
 */

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = DEFAULT_DURATION) => {
      const id = `toast-${++toastIdCounter.current}`;
      const toast = { id, message, type };

      setToasts((prev) => {
        const updated = [...prev, toast];
        // Limit max visible toasts
        if (updated.length > MAX_TOASTS) {
          return updated.slice(-MAX_TOASTS);
        }
        return updated;
      });

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  const showToast = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );

  const showSuccess = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );

  const showError = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration) => addToast(message, 'warning', duration),
    [addToast]
  );

  const clearAll = useCallback(() => setToasts([]), []);

  const value = React.useMemo(
    () => ({
      toasts,
      showToast,
      showSuccess,
      showError,
      showWarning,
      removeToast,
      clearAll,
    }),
    [toasts, showToast, showSuccess, showError, showWarning, removeToast, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '90%',
            maxWidth: '400px',
            pointerEvents: 'none',
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              onClick={() => removeToast(toast.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg, 8px)',
                fontSize: '0.9rem',
                fontWeight: 500,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                pointerEvents: 'auto',
                cursor: 'pointer',
                animation: 'slideUp 0.3s ease-out',
                border: '1px solid',
                ...(toast.type === 'success' && {
                  background: 'color-mix(in srgb, var(--accent-emerald, #10b981) 15%, var(--surface, #fff))',
                  color: 'var(--accent-emerald, #10b981)',
                  borderColor: 'color-mix(in srgb, var(--accent-emerald, #10b981) 30%, transparent)',
                }),
                ...(toast.type === 'error' && {
                  background: 'color-mix(in srgb, var(--accent-rose, #e11d48) 15%, var(--surface, #fff))',
                  color: 'var(--accent-rose, #e11d48)',
                  borderColor: 'color-mix(in srgb, var(--accent-rose, #e11d48) 30%, transparent)',
                }),
                ...(toast.type === 'warning' && {
                  background: 'color-mix(in srgb, var(--accent-amber, #f59e0b) 15%, var(--surface, #fff))',
                  color: 'var(--accent-amber, #f59e0b)',
                  borderColor: 'color-mix(in srgb, var(--accent-amber, #f59e0b) 30%, transparent)',
                }),
                ...(toast.type === 'info' && {
                  background: 'color-mix(in srgb, var(--primary, #0d9488) 15%, var(--surface, #fff))',
                  color: 'var(--primary, #0d9488)',
                  borderColor: 'color-mix(in srgb, var(--primary, #0d9488) 30%, transparent)',
                }),
              }}
            >
              {toast.type === 'success' && '✅ '}
              {toast.type === 'error' && '❌ '}
              {toast.type === 'warning' && '⚠️ '}
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to access notification system.
 * Must be used within a NotificationProvider.
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
