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

      {/* Features Grid */}
      <section role="region" aria-labelledby="features-grid">
        <h2 id="features-grid" className="heading-text text-2xl mb-8 text-center">Available Features</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const iconColors = ['icon-cyan', 'icon-green'];
            const borderColors = ['var(--neon-cyan)', 'var(--neon-green)'];
            const bgColors = ['rgba(0, 229, 255, 0.1)', 'rgba(0, 255, 65, 0.1)'];
            
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="glass-card p-8 text-center w-full transition-all duration-300 hover:scale-105"
                style={{
                  border: `2px solid ${borderColors[index % 2]}`,
                  boxShadow: `0 0 20px ${borderColors[index % 2]}40`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 30px ${borderColors[index % 2]}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px ${borderColors[index % 2]}40`
                }}
                aria-label={`Open ${feature.title}: ${feature.description}`}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto" style={{background: bgColors[index % 2], border: `3px solid ${borderColors[index % 2]}`}}>
                  <IconComponent size={40} className={iconColors[index % 2]} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-4 subheading-text">{feature.title}</h3>
                <p className="paragraph-text text-lg">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DeafPortal;