import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, MessageCircle, Smile } from 'lucide-react';
import TextToSpeech from './features/TextToSpeech';
import PresetPhrases from './features/PresetPhrases';
import EmotionCommunication from './features/EmotionCommunication';


interface MutePortalProps {
  onBack: () => void;
}

type ActiveFeature = 'text-to-speech' | 'preset-phrases' | 'emotion-comm' | null;

const MutePortal: React.FC<MutePortalProps> = ({ onBack }) => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus management for accessibility
    if (portalRef.current) {
      portalRef.current.focus();
    }
  }, []);

  const features = [
    {
      id: 'text-to-speech' as const,
      title: 'Text-to-Speech',
      description: 'Convert your text to natural speech',
      icon: Volume2,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-200'
    },
    {
      id: 'preset-phrases' as const,
      title: 'Preset Phrases',
      description: 'Quick access to common expressions',
      icon: MessageCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      hoverColor: 'hover:bg-green-200'
    },
    {
      id: 'emotion-comm' as const,
      title: 'Emotion Communication',
      description: 'Express feelings with visual symbols',
      icon: Smile,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-200'
    },

  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case 'text-to-speech':
        return <TextToSpeech onClose={() => setActiveFeature(null)} />;
      case 'preset-phrases':
        return <PresetPhrases onClose={() => setActiveFeature(null)} />;
      case 'emotion-comm':
        return <EmotionCommunication onClose={() => setActiveFeature(null)} />;
      default:
        return null;
    }
  };

  if (activeFeature) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {renderFeature()}
      </div>
    );
  }

  return (
    <div 
      ref={portalRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      tabIndex={-1}
      aria-label="Mute User Portal"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
        <button
          onClick={onBack}
          className="nav-item flex items-center space-x-2 mb-4 sm:mb-0 sm:mr-6"
          aria-label="Go back to main page"
        >
          <ArrowLeft size={20} className="icon-cyan sm:w-6 sm:h-6" aria-hidden="true" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{background: 'rgba(255, 0, 128, 0.2)', border: '2px solid var(--neon-pink)'}}>
            <Volume2 size={20} className="icon-pink sm:w-6 sm:h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="heading-text-pink text-xl sm:text-2xl lg:text-3xl">Mute User Portal</h1>
            <p className="paragraph-text text-sm sm:text-base">AI-powered voice communication tools</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section role="region" aria-labelledby="features-grid">
        <h2 id="features-grid" className="heading-text text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-center">Communication Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const iconColors = ['icon-pink', 'icon-cyan', 'icon-yellow'];
            const borderColors = ['var(--neon-pink)', 'var(--neon-cyan)', 'var(--neon-yellow)'];
            const bgColors = ['rgba(255, 0, 128, 0.1)', 'rgba(0, 229, 255, 0.1)', 'rgba(255, 255, 0, 0.1)'];
            
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="glass-card p-4 sm:p-6 lg:p-8 text-center w-full transition-all duration-300 hover:scale-105"
                style={{
                  border: `2px solid ${borderColors[index % 3]}`,
                  boxShadow: `0 0 15px ${borderColors[index % 3]}40`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 25px ${borderColors[index % 3]}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 15px ${borderColors[index % 3]}40`
                }}
                aria-label={`Open ${feature.title}: ${feature.description}`}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 mx-auto" style={{background: bgColors[index % 3], border: `2px sm:3px solid ${borderColors[index % 3]}`}}>
                  <IconComponent size={24} className={`${iconColors[index % 3]} sm:w-8 sm:h-8 lg:w-10 lg:h-10`} aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 subheading-text">{feature.title}</h3>
                <p className="paragraph-text text-sm sm:text-base lg:text-lg">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>


    </div>
  );
};

export default MutePortal;