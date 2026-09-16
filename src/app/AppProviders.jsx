/**
 * App Providers
 * ==============
 * Composes all application-level context providers in the correct
 * dependency order. This is the single entry point for state management.
 *
 * Provider Order (outermost → innermost):
 * 1. AuthProvider     — needs no other provider
 * 2. ThemeProvider    — needs no other provider
 * 3. AudioProvider    — needs no other provider
 * 4. NotificationProvider — needs no other provider, renders toast UI
 */

import React from 'react';
import { AuthProvider } from '../store/AuthContext';
import { ThemeProvider } from '../store/ThemeContext';
import { AudioProvider } from '../store/AudioContext';
import { NotificationProvider } from '../store/NotificationContext';

export const AppProviders = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <AudioProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AudioProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default AppProviders;
