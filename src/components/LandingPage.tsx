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
        <h1 className="heading-text-large mb-6 leading-tight">
          Breaking Communication
          <span className="block heading-text-pink">
            Barriers Together
          </span>
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed subheading-text">
          AssistConnect empowers the deaf and mute community with AI-powered tools, 
          real-time communication features, and inclusive technologies designed for accessibility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 text-sm paragraph-text">
            <Shield size={16} className="icon-cyan" aria-hidden="true" />
            <span>ARIA Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-sm paragraph-text">
            <Globe size={16} className="icon-green" aria-hidden="true" />
            <span>Multilingual Support</span>
          </div>
          <div className="flex items-center space-x-2 text-sm paragraph-text">
            <Zap size={16} className="icon-yellow" aria-hidden="true" />
            <span>AI-Powered</span>
          </div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="grid md:grid-cols-2 gap-8 mb-16" role="main">
        <article className="glass-card-green overflow-hidden">
          <div className="p-8" style={{background: 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))'}}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                <VolumeX size={32} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-orbitron">Deaf User Portal</h2>
                <p className="text-white/80">Visual & vibration-based communication</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-center space-x-3">
                <Volume2 size={20} className="icon-green" aria-hidden="true" />
                <span className="subheading-text">Real-time speech-to-text captioning</span>
              </li>
              <li className="flex items-center space-x-3">
                <Globe size={20} className="icon-cyan" aria-hidden="true" />
                <span className="subheading-text">Multilingual translation support</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle size={20} className="icon-green" aria-hidden="true" />
                <span className="subheading-text">Conversation text-to-speech</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPortal('deaf')}
              className="w-full btn-neon-green py-4 px-6 text-lg font-semibold"
              aria-label="Enter Deaf User Portal"
            >
              Enter Deaf Portal
            </button>
          </div>
        </article>

        <article className="glass-card-pink overflow-hidden">
          <div className="p-8" style={{background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-violet))'}}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                <Volume2 size={32} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-orbitron">Mute User Portal</h2>
                <p className="text-white/80">AI-powered voice communication</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-center space-x-3">
                <Volume2 size={20} className="icon-pink" aria-hidden="true" />
                <span className="subheading-text">Text-to-speech communicator</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle size={20} className="icon-violet" aria-hidden="true" />
                <span className="subheading-text">Pre-set phrases & smart suggestions</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap size={20} className="icon-yellow" aria-hidden="true" />
                <span className="subheading-text">Emotion-based communication</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPortal('mute')}
              className="w-full btn-neon-pink py-4 px-6 text-lg font-semibold"
              aria-label="Enter Mute User Portal"
            >
              Enter Mute Portal
            </button>
          </div>
        </article>
      </section>

      {/* Features Overview */}
      <section className="glass-card p-8 md:p-12 mb-16" role="region" aria-labelledby="features-heading">
        <h2 id="features-heading" className="heading-text text-3xl mb-12">
          Powered by Advanced AI Technology
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(0, 229, 255, 0.1)', border: '2px solid var(--neon-cyan)'}}>
              <MessageCircle size={32} className="icon-cyan" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-3 heading-text-violet">Real-time Communication</h3>
            <p className="paragraph-text">
              Instant speech-to-text, text-to-speech, and sign language recognition
              for seamless conversations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(0, 255, 65, 0.1)', border: '2px solid var(--neon-green)'}}>
              <AlertTriangle size={32} className="icon-green" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-3 heading-text-green">Smart Alerts</h3>
            <p className="paragraph-text">
              AI-powered environmental awareness with visual notifications,
              vibrations, and emergency alerts.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(255, 0, 128, 0.1)', border: '2px solid var(--neon-pink)'}}>
              <Globe size={32} className="icon-pink" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold mb-3 heading-text-pink">Inclusive Design</h3>
            <p className="paragraph-text">
              ARIA-compliant interface with multilingual support and 
              accessibility-first design principles.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 paragraph-text" role="contentinfo">
        <p>&copy; 2025 AssistConnect. Making communication accessible for everyone.</p>
      </footer>
    </div>
  );
};

export default LandingPage;