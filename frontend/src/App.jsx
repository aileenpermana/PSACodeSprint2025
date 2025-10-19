import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Auth Pages
import SignUpPage from './components/Auth/SignUpPage';
import SignInPage from './components/Auth/SignInPage';
import SignInAltPage from './components/Auth/SignInAltPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';

// Profile Pages
import ProfileDashboard from './components/Profile/ProfileDashboard';
import ProfileSetup from './components/Profile/ProfileSetup';
import EditProfile from './components/Profile/EditProfile';

//Exploration Page
import ExplorePage from './components/Explore/ExplorePage';
import CareerLiftPage from './components/Explore/CareerLiftPage';
import ContinentViewPage from './components/Explore/ContinentViewPage';

// AI Components
import AIChatPage from './components/AI/AIChatPage';

// Mentor Components
import MentorFinder from './components/Mentor/MentorFinder';
import MentorProfile from './components/Mentor/MentorProfile';
import MentorChat from './components/Mentor/MentorChat';

// Wellbeing Components
import WellbeingDashboard from './components/Wellbeing/WellbeingDashboard';
import WeeklySurvey from './components/Wellbeing/WeeklySurvey';

// Leadership Component
import LeadershipPotential from './components/Leadership/LeadershipPotential';

// Achievement Pages
import BadgeSystem from './components/Achievements/BadgeSystem';

// Import supabase
import { supabase } from './services/supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount AND listen for changes
  useEffect(() => {
    // Get initial session
    checkAuth();

    // Listen for auth changes (sign in, sign out, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--psa-dark)'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--psa-secondary)' }}>
            Loading...
          </div>
        </div>
      );
    }

    return user ? children : <Navigate to="/signin" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />
        <Route path="/signin" element={user ? <Navigate to="/dashboard" replace /> : <SignInPage />} />
        <Route path="/signin-alt" element={user ? <Navigate to="/dashboard" replace /> : <SignInAltPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore/career-lift" 
          element={
            <ProtectedRoute>
              <CareerLiftPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore/continent/:divisionId" 
          element={
            <ProtectedRoute>
              <ContinentViewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-chat" 
          element={
            <ProtectedRoute>
              <AIChatPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentors" 
          element={
            <ProtectedRoute>
              <MentorFinder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentor/:mentorId" 
          element={
            <ProtectedRoute>
              <MentorProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:mentorId" 
          element={
            <ProtectedRoute>
              <MentorChat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wellbeing" 
          element={
            <ProtectedRoute>
              <WellbeingDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wellbeing/survey" 
          element={
            <ProtectedRoute>
              <WeeklySurvey />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leadership" 
          element={
            <ProtectedRoute>
              <LeadershipPotential />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/achievements" 
          element={
            <ProtectedRoute>
              <BadgeSystem />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to dashboard or signin */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signin"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;