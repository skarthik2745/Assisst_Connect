import React from 'react';
import { Home, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import type { ActiveView } from '../App';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  return (
    <header 
      className="bg-white shadow-lg border-b-4 border-blue-500"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl" aria-hidden="true">AC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AssistConnect
              </h1>
              <p className="text-sm text-gray-600">Inclusive Accessibility Platform</p>
            </div>
          </div>

          <nav 
            className="flex items-center space-x-4"
            role="navigation"
            aria-label="Main navigation"
          >
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'landing'
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Go to home page"
              aria-current={activeView === 'landing' ? 'page' : undefined}
            >
              <Home size={20} aria-hidden="true" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('deaf')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'deaf'
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Access Deaf User Portal"
              aria-current={activeView === 'deaf' ? 'page' : undefined}
            >
              <VolumeX size={20} aria-hidden="true" />
              <span>Deaf Portal</span>
            </button>

            <button
              onClick={() => onNavigate('mute')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === 'mute'
                  ? 'bg-purple-100 text-purple-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              aria-label="Access Mute User Portal"
              aria-current={activeView === 'mute' ? 'page' : undefined}
            >
              <Volume2 size={20} aria-hidden="true" />
              <span>Mute Portal</span>
            </button>

            <div className="flex items-center space-x-2 ml-6 pl-6 border-l border-gray-200">
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
                aria-label="Settings"
                title="Settings"
              >
                <Settings size={20} aria-hidden="true" />
              </button>
              
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
                aria-label="Help and support"
                title="Help"
              >
                <HelpCircle size={20} aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;