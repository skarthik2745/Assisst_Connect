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
      aria-label="Mute User Portal"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to main page"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Volume2 size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mute User Portal</h1>
            <p className="text-gray-600">AI-powered voice communication tools</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bg-purple-50 rounded-2xl p-6 mb-8" role="region" aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button 
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Quick text-to-speech"
            onClick={() => setActiveFeature('text-to-speech')}
          >
            <Volume2 size={24} className="text-purple-500" aria-hidden="true" />
            <span className="text-sm font-medium">Speak</span>
          </button>
          
          <button 
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Access preset phrases"
            onClick={() => setActiveFeature('preset-phrases')}
          >
            <MessageCircle size={24} className="text-green-500" aria-hidden="true" />
            <span className="text-sm font-medium">Phrases</span>
          </button>
          
          <button 
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Express emotions"
            onClick={() => setActiveFeature('emotion-comm')}
          >
            <Smile size={24} className="text-yellow-500" aria-hidden="true" />
            <span className="text-sm font-medium">Emotions</span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section role="region" aria-labelledby="features-grid">
        <h2 id="features-grid" className="text-2xl font-bold text-gray-900 mb-8">Communication Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full ${feature.hoverColor}`}
                aria-label={`Open ${feature.title}: ${feature.description}`}
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <IconComponent size={24} className={feature.textColor} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>


    </div>
  );
};

export default MutePortal;