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
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to main page"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <VolumeX size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deaf User Portal</h1>
            <p className="text-gray-600">Visual communication tools & alerts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="bg-green-50 rounded-2xl p-6 mb-8" role="region" aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Start speech to text"
            onClick={() => setActiveFeature('speech-to-text')}
          >
            <Mic size={24} className="text-blue-500" aria-hidden="true" />
            <span className="text-sm font-medium">Speech to Text</span>
          </button>
          
          <button 
            className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label="Access multilingual support"
            onClick={() => setActiveFeature('multilingual')}
          >
            <Globe size={24} className="text-blue-500" aria-hidden="true" />
            <span className="text-sm font-medium">Translate</span>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section role="region" aria-labelledby="features-grid">
        <h2 id="features-grid" className="text-2xl font-bold text-gray-900 mb-8">Available Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

export default DeafPortal;