import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
 
  Captions, 
  Hand, 
  Volume2, 
  VolumeX,
  Bell, 
  MessageCircle,
  Globe,
  AlertTriangle,
  Users
} from 'lucide-react';
import SpeechToText from './features/SpeechToText';
import MultilingualSupport from './features/MultilingualSupport';


interface DeafPortalProps {
  onBack: () => void;
}

type ActiveFeature = 'speech-to-text' | 'multilingual' | null;

const DeafPortal: React.FC<DeafPortalProps> = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);
  const [isListening, setIsListening] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus management for accessibility
    if (portalRef.current) {
      portalRef.current.focus();
    }
  }, []);

  const features = [
    {
      id: 'speech-to-text' as const,
      title: 'Speech-to-Text',
      description: 'Real-time conversation captioning',
      icon: Mic,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-200'
    },

    {
      id: 'multilingual' as const,
      title: 'Multilingual Support',
      description: 'Real-time translation and multilingual communication',
      icon: Globe,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-200'
    }
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case 'speech-to-text':
        return <SpeechToText onClose={() => setActiveFeature(null)} />;
      case 'multilingual':
        return <MultilingualSupport onClose={() => setActiveFeature(null)} />;
      default:
        return null;
    }
  };

  if (activeFeature) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderFeature()}
      </div>
    );
  }

  return (
    <div 
      ref={portalRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      tabIndex={-1}
      aria-label="Deaf User Portal"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="nav-item flex items-center space-x-2 mr-6"
          aria-label="Go back to main page"
        >
          <ArrowLeft size={24} className="icon-cyan" aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'rgba(0, 255, 65, 0.2)', border: '2px solid var(--neon-green)'}}>
            <VolumeX size={24} className="icon-green" aria-hidden="true" />
          </div>
          <div>
            <h1 className="heading-text-green text-3xl">Deaf User Portal</h1>
            <p className="paragraph-text">Visual communication tools & alerts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="glass-card-green p-6 mb-8" role="region" aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="heading-text-green text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="glass-card flex flex-col items-center space-y-2 p-4"
            aria-label="Start speech to text"
            onClick={() => setActiveFeature('speech-to-text')}
          >
            <Mic size={24} className="icon-cyan" aria-hidden="true" />
            <span className="text-sm font-medium subheading-text">Speech to Text</span>
          </button>
          
          <button 
            className="glass-card flex flex-col items-center space-y-2 p-4"
            aria-label="Access multilingual support"
            onClick={() => setActiveFeature('multilingual')}
          >
            <Globe size={24} className="icon-green" aria-hidden="true" />
            <span className="text-sm font-medium subheading-text">Translate</span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section role="region" aria-labelledby="features-grid">
        <h2 id="features-grid" className="heading-text text-2xl mb-8">Available Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const iconColors = ['icon-cyan', 'icon-green', 'icon-pink', 'icon-yellow'];
            const borderColors = ['var(--neon-cyan)', 'var(--neon-green)', 'var(--neon-pink)', 'var(--neon-yellow)'];
            const bgColors = ['rgba(0, 229, 255, 0.1)', 'rgba(0, 255, 65, 0.1)', 'rgba(255, 0, 128, 0.1)', 'rgba(255, 255, 0, 0.1)'];
            
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="glass-card p-6 text-left w-full"
                aria-label={`Open ${feature.title}: ${feature.description}`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{background: bgColors[index % 4], border: `2px solid ${borderColors[index % 4]}`}}>
                  <IconComponent size={24} className={iconColors[index % 4]} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2 subheading-text">{feature.title}</h3>
                <p className="paragraph-text">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DeafPortal;