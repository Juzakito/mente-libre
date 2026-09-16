import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './config/routes';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const B2BDashboard = lazy(() => import('./pages/B2BDashboard'));
const CodeEntry = lazy(() => import('./pages/CodeEntry'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));
const Feed = lazy(() => import('./pages/Feed'));
const Explore = lazy(() => import('./pages/Explore'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Donate = lazy(() => import('./pages/Donate'));
const Mood = lazy(() => import('./pages/Mood'));
const Experts = lazy(() => import('./pages/Experts'));
const Appointments = lazy(() => import('./pages/Appointments'));

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
                  <Route path="explore" element={<Explore />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="u/:nickname" element={<PublicProfile />} />
                  <Route path="donate" element={<Donate />} />
                  <Route path="mood" element={<Mood />} />
                  <Route path="expertos" element={<Experts />} />
                  <Route path="citas" element={<Appointments />} />
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
