import React, { useState } from 'react';
import { ArrowLeft, Smile, Frown, Heart, AlertTriangle, Star, Zap, Volume2, Leaf, Flame, HelpCircle } from 'lucide-react';

interface EmotionCommunicationProps {
  onClose: () => void;
}

interface Emotion {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  color: string;
  bgColor: string;
  message: string;
  intensity: 'low' | 'medium' | 'high';
}

const EmotionCommunication: React.FC<EmotionCommunicationProps> = ({ onClose }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const emotions: Emotion[] = [
    {
      id: 'happy',
      icon: Smile,
      label: 'Happy',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 hover:bg-yellow-200',
      message: "I'm feeling happy and positive!",
      intensity: 'high'
    },
    {
      id: 'sad',
      icon: Frown,
      label: 'Sad',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 hover:bg-blue-200',
      message: "I'm feeling a bit sad right now.",
      intensity: 'low'
    },
    {
      id: 'love',
      icon: Heart,
      label: 'Love',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 hover:bg-pink-200',
      message: "I love you and appreciate you!",
      intensity: 'medium'
    },
    {
      id: 'urgent',
      icon: AlertTriangle,
      label: 'Urgent',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 hover:bg-orange-200',
      message: "This is urgent, I need immediate attention!",
      intensity: 'high'
    },
    {
      id: 'excited',
      icon: Star,
      label: 'Excited',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 hover:bg-purple-200',
      message: "I'm so excited about this!",
      intensity: 'high'
    },
    {
      id: 'frustrated',
      icon: Zap,
      label: 'Frustrated',
      color: 'text-red-700',
      bgColor: 'bg-red-100 hover:bg-red-200',
      message: "I'm feeling frustrated and need help.",
      intensity: 'medium'
    },
    {
      id: 'calm',
      icon: Leaf,
      label: 'Calm/Relaxed',
      color: 'text-green-600',
      bgColor: 'bg-green-100 hover:bg-green-200',
      message: "I'm feeling calm and peaceful.",
      intensity: 'low'
    },
    {
      id: 'angry',
      icon: Flame,
      label: 'Angry',
      color: 'text-red-800',
      bgColor: 'bg-red-200 hover:bg-red-300',
      message: "I'm feeling angry about this situation!",
      intensity: 'high'
    },
    {
      id: 'confused',
      icon: HelpCircle,
      label: 'Confused',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      message: "I'm confused and need clarification.",
      intensity: 'medium'
    }
  ];

  const speakEmotion = (emotion: Emotion) => {
    const messageToSpeak = customMessage.trim() || emotion.message;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(messageToSpeak);
      
      // Get intensity multiplier
      const intensityMultiplier = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.2
      }[emotion.intensity];
      
      // Unique voice modulation for each emotion with intensity variation
      switch (emotion.id) {
        case 'happy':
          // Cheerful, lively, uplifting - bright timbre, smiling tone
          utterance.rate = (1.1 + (intensityMultiplier - 1) * 0.3);
          utterance.pitch = (1.25 + (intensityMultiplier - 1) * 0.2);
          utterance.volume = Math.min(1.0, 0.85 + (intensityMultiplier - 1) * 0.15);
          break;
          
        case 'sad':
          // Soft, slow, low-pitched - gentle downward intonation
          utterance.rate = (0.65 - (intensityMultiplier - 1) * 0.1);
          utterance.pitch = (0.75 - (intensityMultiplier - 1) * 0.1);
          utterance.volume = Math.max(0.4, 0.55 - (intensityMultiplier - 1) * 0.1);
          break;
          
        case 'love':
          // Warm, tender, affectionate - smooth flow, gentle
          utterance.rate = (0.85 + (intensityMultiplier - 1) * 0.1);
          utterance.pitch = (1.05 + (intensityMultiplier - 1) * 0.15);
          utterance.volume = Math.min(0.9, 0.75 + (intensityMultiplier - 1) * 0.1);
          break;
          
        case 'urgent':
          // Sharp, direct, commanding - firm stress, immediate action
          utterance.rate = (1.25 + (intensityMultiplier - 1) * 0.2);
          utterance.pitch = (1.15 + (intensityMultiplier - 1) * 0.1);
          utterance.volume = Math.min(1.0, 0.9 + (intensityMultiplier - 1) * 0.1);
          break;
          
        case 'excited':
          // Highly energetic, enthusiastic - high pitch variation, animated
          utterance.rate = (1.3 + (intensityMultiplier - 1) * 0.3);
          utterance.pitch = (1.35 + (intensityMultiplier - 1) * 0.25);
          utterance.volume = Math.min(1.0, 0.9 + (intensityMultiplier - 1) * 0.1);
          break;
          
        case 'frustrated':
          // Tense, impatient, rough - uneven pacing, sharp edges
          utterance.rate = (1.05 + (intensityMultiplier - 1) * 0.2);
          utterance.pitch = (0.9 + (intensityMultiplier - 1) * 0.1);
          utterance.volume = Math.min(0.95, 0.8 + (intensityMultiplier - 1) * 0.15);
          break;
          
        case 'calm':
          // Smooth, steady, soothing - peaceful, meditation-like
          utterance.rate = (0.75 - (intensityMultiplier - 1) * 0.05);
          utterance.pitch = (0.95 + (intensityMultiplier - 1) * 0.05);
          utterance.volume = Math.max(0.5, 0.65 - (intensityMultiplier - 1) * 0.1);
          break;
          
        case 'angry':
          // Intense, firm, aggressive - harsh timbre, clipped words
          utterance.rate = (0.95 + (intensityMultiplier - 1) * 0.15);
          utterance.pitch = (0.8 - (intensityMultiplier - 1) * 0.05);
          utterance.volume = Math.min(1.0, 0.85 + (intensityMultiplier - 1) * 0.15);
          break;
          
        case 'confused':
          // Hesitant, uncertain, questioning - uneven intonation
          utterance.rate = (0.85 + (intensityMultiplier - 1) * 0.1);
          utterance.pitch = (1.08 + (intensityMultiplier - 1) * 0.12);
          utterance.volume = Math.min(0.85, 0.7 + (intensityMultiplier - 1) * 0.1);
          break;
          
        default:
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
      }
      
      // Add emotion-specific text modifications for better expression
      let modifiedText = messageToSpeak;
      if (emotion.id === 'confused') {
        // Add questioning tone by ending with slight upward inflection
        modifiedText = messageToSpeak.replace(/[.!]$/, '?');
      } else if (emotion.id === 'excited') {
        // Add exclamation for excitement
        modifiedText = messageToSpeak.replace(/[.]$/, '!');
      }
      
      utterance.text = modifiedText;
      speechSynthesis.speak(utterance);
    }
    
    setSelectedEmotion(emotion);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to mute portal"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Smile size={24} className="text-yellow-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emotion Communication</h1>
            <p className="text-gray-600">Express your feelings with visual symbols</p>
          </div>
        </div>
      </div>

      {/* Custom Message Input */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Message</h2>
        <div className="flex space-x-4">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type a custom message to speak with emotion..."
            className="flex-1 h-24 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            aria-label="Custom emotion message"
          />
          <button
            onClick={() => {
              if (customMessage.trim() && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(customMessage);
                speechSynthesis.speak(utterance);
              }
            }}
            disabled={!customMessage.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Speak custom message"
          >
            <Volume2 size={20} aria-hidden="true" />
            <span>Speak</span>
          </button>
        </div>
      </div>

      {/* Emotion Grid */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Choose Your Emotion</h2>
          <p className="text-gray-600">Select an emotion to express your current feeling</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {emotions.map((emotion) => {
              const IconComponent = emotion.icon;
              return (
                <button
                  key={emotion.id}
                  onClick={() => speakEmotion(emotion)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    selectedEmotion?.id === emotion.id
                      ? 'border-gray-400 shadow-lg scale-105'
                      : 'border-gray-200'
                  } ${emotion.bgColor}`}
                  aria-label={`Express ${emotion.label}: ${emotion.message}`}
                >
                  <div className="text-center">
                    <IconComponent 
                      size={48} 
                      className={`mx-auto mb-3 ${emotion.color}`} 
                      aria-hidden="true"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {emotion.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {emotion.message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Emotions */}
      {selectedEmotion && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Expressed Emotion</h3>
          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className={`w-12 h-12 ${selectedEmotion.bgColor.split(' ')[0]} rounded-full flex items-center justify-center`}>
              <selectedEmotion.icon size={24} className={selectedEmotion.color} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{selectedEmotion.label}</h4>
              <p className="text-gray-600">{customMessage.trim() || selectedEmotion.message}</p>
            </div>
            <button
              onClick={() => speakEmotion(selectedEmotion)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
              aria-label="Speak last emotion again"
            >
              <Volume2 size={16} aria-hidden="true" />
              <span>Repeat</span>
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Emotion Communication</h3>
        <ul className="space-y-2 text-blue-800" role="list">
          <li>• Click on any emotion symbol to instantly express that feeling</li>
          <li>• Type a custom message to add personal context to your emotion</li>
          <li>• Different emotions use different voice tones and speeds</li>
          <li>• High intensity emotions are spoken with more emphasis</li>
          <li>• Your last emotion is saved for quick re-expression</li>
        </ul>
      </div>
    </div>
  );
};

export default EmotionCommunication;