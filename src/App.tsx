import React, { useState, useEffect, Suspense } from 'react';
import LandingPage from './components/LandingPage';
import DeafPortal from './components/DeafPortal';
import MutePortal from './components/MutePortal';
import Header from './components/Header';
import Profile from './components/Profile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { MediaManager, AccessibilityUtils } from './utils/performance';
import { useAuth } from './hooks/useAuth';
import supabase from './lib/supabase';

export type ActiveView = 'landing' | 'deaf' | 'mute' | 'profile' | 'login' | 'signup';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AssistConnect Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner: React.FC = () => (
  <>
    <div className="animated-gradient-bg"></div>
    <div className="content-overlay min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="heading-text font-medium">Loading AssistConnect...</p>
      </div>
    </div>
  </>
);

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('login');
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Reset to landing page when user logs in
  React.useEffect(() => {
    if (user && (activeView === 'login' || activeView === 'signup')) {
      setActiveView('landing');
    }
  }, [user, activeView]);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase.from('preset_phrases').select('count').limit(1);
        if (error) {
          console.error('❌ Supabase connection failed:', error.message);
        } else {
          console.log('✅ Supabase connected successfully!');
        }
        
        // Announce app load to screen readers
        AccessibilityUtils.announce('AssistConnect application loaded');
        
        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      MediaManager.cleanup();
    };
  }, []);

  if (isLoading || authLoading) {
    return <LoadingSpinner />;
  }

  const renderView = () => {
    // If user is not logged in, show only auth pages
    if (!user) {
      switch (activeView) {
        case 'signup':
          return (
            <Signup 
              onClose={() => setActiveView('login')} 
              onSwitchToLogin={() => setActiveView('login')}
            />
          );
        default:
          return (
            <Login 
              onClose={() => setActiveView('login')} 
              onSwitchToSignup={() => setActiveView('signup')}
            />
          );
      }
    }

    // If user is logged in, show main app
    switch (activeView) {
      case 'deaf':
        return <DeafPortal onBack={() => setActiveView('landing')} />;
      case 'mute':
        return <MutePortal onBack={() => setActiveView('landing')} />;
      case 'profile':
        return <Profile onBack={() => setActiveView('landing')} />;
      default:
        return <LandingPage onSelectPortal={setActiveView} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="animated-gradient-bg"></div>
      <div className="content-overlay min-h-screen">
        {user && <Header activeView={activeView} onNavigate={setActiveView} user={user} />}
        <main role="main" aria-label="Main content">
          <Suspense fallback={<LoadingSpinner />}>
            {renderView()}
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;