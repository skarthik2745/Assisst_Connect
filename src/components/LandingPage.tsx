import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Captions, 
  Hand, 
  AlertTriangle,
  Users,
  Globe,
  Zap,
  Shield
} from 'lucide-react';
import type { ActiveView } from '../App';

interface LandingPageProps {
  onSelectPortal: (view: ActiveView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16" role="banner">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Breaking Communication
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Barriers Together
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          AssistConnect empowers the deaf and mute community with AI-powered tools, 
          real-time communication features, and inclusive technologies designed for accessibility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield size={16} aria-hidden="true" />
            <span>ARIA Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Globe size={16} aria-hidden="true" />
            <span>Multilingual Support</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Zap size={16} aria-hidden="true" />
            <span>AI-Powered</span>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="grid md:grid-cols-2 gap-8 mb-16" role="main">
        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <VolumeX size={32} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Deaf User Portal</h2>
                <p className="text-green-100">Visual & vibration-based communication</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-center space-x-3">
                <Volume2 size={20} className="text-green-600" aria-hidden="true" />
                <span>Real-time speech-to-text captioning</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe size={20} className="text-green-600" aria-hidden="true" />
                <span>Multilingual translation support</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-green-600" aria-hidden="true" />
                <span>Conversation text-to-speech</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPortal('deaf')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Enter Deaf User Portal"
            >
              Enter Deaf Portal
            </button>
          </div>
        </article>

        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Volume2 size={32} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Mute User Portal</h2>
                <p className="text-purple-100">AI-powered voice communication</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-center space-x-3">
                <Volume2 size={20} className="text-purple-600" aria-hidden="true" />
                <span>Text-to-speech communicator</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle size={20} className="text-purple-600" aria-hidden="true" />
                <span>Pre-set phrases & smart suggestions</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap size={20} className="text-purple-600" aria-hidden="true" />
                <span>Emotion-based communication</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPortal('mute')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Enter Mute User Portal"
            >
              Enter Mute Portal
            </button>
          </div>
        </article>
      </section>

      {/* Features Overview */}
      <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16" role="region" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powered by Advanced AI Technology
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} className="text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Communication</h3>
            <p className="text-gray-600">
              Instant speech-to-text, text-to-speech, and sign language recognition
              for seamless conversations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Alerts</h3>
            <p className="text-gray-600">
              AI-powered environmental awareness with visual notifications,
              vibrations, and emergency alerts.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe size={32} className="text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Inclusive Design</h3>
            <p className="text-gray-600">
              ARIA-compliant interface with multilingual support and 
              accessibility-first design principles.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500" role="contentinfo">
        <p>&copy; 2025 AssistConnect. Making communication accessible for everyone.</p>
      </footer>
    </div>
  );
};

export default LandingPage;