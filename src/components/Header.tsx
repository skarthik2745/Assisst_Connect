import React from 'react';
import { Home, Volume2, VolumeX, User, LogIn } from 'lucide-react';
import type { ActiveView } from '../App';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  user?: any;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, user }) => {
  return (
    <header 
      className="shadow-lg border-b-4"
      style={{
        background: 'rgba(10, 25, 47, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottomColor: 'var(--neon-cyan)'
      }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
              }}
            >
              <span className="text-white font-bold text-xl font-orbitron" aria-hidden="true">AC</span>
            </div>
            <div>
              <h1 className="heading-text text-2xl">
                AssistConnect
              </h1>
              <p className="text-sm" style={{color: 'var(--muted-white)'}}>Inclusive Accessibility Platform</p>
            </div>
          </div>

          <nav 
            className="flex items-center space-x-4"
            role="navigation"
            aria-label="Main navigation"
          >
            <button
              onClick={() => onNavigate('landing')}
              className={`nav-item flex items-center space-x-2 ${
                activeView === 'landing' ? 'text-cyan-400' : ''
              }`}
              aria-label="Go to home page"
              aria-current={activeView === 'landing' ? 'page' : undefined}
            >
              <Home size={20} className="icon-cyan" aria-hidden="true" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('deaf')}
              className={`nav-item-green flex items-center space-x-2 ${
                activeView === 'deaf' ? 'text-green-400' : ''
              }`}
              aria-label="Access Deaf User Portal"
              aria-current={activeView === 'deaf' ? 'page' : undefined}
            >
              <VolumeX size={20} className="icon-green" aria-hidden="true" />
              <span>Deaf Portal</span>
            </button>

            <button
              onClick={() => onNavigate('mute')}
              className={`nav-item-pink flex items-center space-x-2 ${
                activeView === 'mute' ? 'text-pink-400' : ''
              }`}
              aria-label="Access Mute User Portal"
              aria-current={activeView === 'mute' ? 'page' : undefined}
            >
              <Volume2 size={20} className="icon-pink" aria-hidden="true" />
              <span>Mute Portal</span>
            </button>


            {/* Authentication/Profile Section */}
            <div className="ml-4 sm:ml-6 pl-4 sm:pl-6 border-l" style={{borderColor: 'rgba(0, 229, 255, 0.2)'}}>
              {user ? (
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    ...(activeView === 'profile' 
                      ? {
                          background: 'rgba(124, 58, 237, 0.2)',
                          color: '#7c3aed',
                          border: '1px solid rgba(124, 58, 237, 0.3)',
                          boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)'
                        }
                      : {
                          color: '#ffffff'
                        }
                    )
                  }}
                  onMouseEnter={(e) => {
                    if (activeView !== 'profile') {
                      e.currentTarget.style.color = '#00e5ff';
                      e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeView !== 'profile') {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  aria-label="View Profile"
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center border overflow-hidden"
                    style={{
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      background: user?.user_metadata?.avatar_url 
                        ? `url(${user.user_metadata.avatar_url})` 
                        : 'rgba(0, 229, 255, 0.2)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!user?.user_metadata?.avatar_url && (
                      <User size={12} style={{color: '#00e5ff'}} />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm sm:text-base">
                    {user?.user_metadata?.username || 'Profile'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{color: '#ffffff'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#00e5ff';
                    e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label="Login"
                >
                  <LogIn size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
                  <span className="hidden sm:inline text-sm sm:text-base">Login</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;