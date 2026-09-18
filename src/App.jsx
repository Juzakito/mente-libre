import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './config/routes';

// Helper to safely load dynamic chunks with automatic refresh upon new deployments
const lazyRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn('Chunk load error, refreshing for latest deployment...', error);
      const lastReload = parseInt(sessionStorage.getItem('last_chunk_reload') || '0', 10);
      const now = Date.now();
      if (now - lastReload > 3000) {
        sessionStorage.setItem('last_chunk_reload', now.toString());
        window.location.reload();
        return new Promise(() => {}); // Wait for reload
      }
      throw error;
    }
  });

// Lazy load pages with auto-reload resilience
const Landing = lazyRetry(() => import('./pages/Landing'));
const B2BDashboard = lazyRetry(() => import('./pages/B2BDashboard'));
const CodeEntry = lazyRetry(() => import('./pages/CodeEntry'));
const Onboarding = lazyRetry(() => import('./pages/Onboarding'));
const UpdatePassword = lazyRetry(() => import('./pages/UpdatePassword'));
const Feed = lazyRetry(() => import('./pages/Feed'));
const Rooms = lazyRetry(() => import('./pages/Rooms'));
const Explore = lazyRetry(() => import('./pages/Explore'));
const Chat = lazyRetry(() => import('./pages/Chat'));
const Profile = lazyRetry(() => import('./pages/Profile'));
const PublicProfile = lazyRetry(() => import('./pages/PublicProfile'));
const Donate = lazyRetry(() => import('./pages/Donate'));
const Mood = lazyRetry(() => import('./pages/Mood'));
const Experts = lazyRetry(() => import('./pages/Experts'));
const Appointments = lazyRetry(() => import('./pages/Appointments'));
const Dotz = lazyRetry(() => import('./pages/Dotz'));
const SOS = lazyRetry(() => import('./pages/SOS'));
const Helpline = lazyRetry(() => import('./pages/Helpline'));
const Security = lazyRetry(() => import('./pages/Security'));
const Improvements = lazyRetry(() => import('./pages/Improvements'));
const Guide = lazyRetry(() => import('./pages/Guide'));
const About = lazyRetry(() => import('./pages/About'));

// Loading Fallback
const LoadingScreen = () => (
  <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <div style={{ fontSize: '4rem', animation: 'pulse-soft 1.5s infinite', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🦉</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="app-container">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<Landing />} />
                <Route path="/landing" element={<Navigate to={ROUTES.HOME} replace />} />
                <Route path={ROUTES.B2B} element={<B2BDashboard />} />
                <Route path={ROUTES.CODE_ENTRY} element={<CodeEntry />} />
                <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
                <Route path={ROUTES.UPDATE_PASSWORD} element={<UpdatePassword />} />
                
                <Route path={ROUTES.APP.ROOT} element={<MainLayout />}>
                  <Route index element={<Navigate to={ROUTES.APP.FEED} replace />} />
                  <Route path="feed" element={<Feed />} />
                  <Route path="salas" element={<Rooms />} />
                  <Route path="explore" element={<Explore />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="u/:nickname" element={<PublicProfile />} />
                  <Route path="donate" element={<Donate />} />
                  <Route path="mood" element={<Mood />} />
                  <Route path="expertos" element={<Experts />} />
                  <Route path="citas" element={<Appointments />} />
                  <Route path="dotz" element={<Dotz />} />
                  <Route path="sos" element={<SOS />} />
                  <Route path="helpline" element={<Helpline />} />
                  <Route path="security" element={<Security />} />
                  <Route path="improvements" element={<Improvements />} />
                  <Route path="guide" element={<Guide />} />
                  <Route path="about" element={<About />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
