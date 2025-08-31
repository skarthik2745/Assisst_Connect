import React, { useState } from 'react';
import { ArrowLeft, Phone, PhoneOff, Volume2, Mic, User, Clock } from 'lucide-react';

interface VoiceCallProps {
  onClose: () => void;
}

const VoiceCall: React.FC<VoiceCallProps> = ({ onClose }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messageToSpeak, setMessageToSpeak] = useState('');
  const [callHistory, setCallHistory] = useState([
    { id: 1, contact: 'Dr. Smith', duration: '5:23', time: '2 hours ago', type: 'outgoing' },
    { id: 2, contact: 'Mom', duration: '12:45', time: 'Yesterday', type: 'incoming' },
    { id: 3, contact: 'Work Office', duration: '3:12', time: '2 days ago', type: 'outgoing' }
  ]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setIsInCall(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallDuration(0);
  };

  const speakMessage = () => {
    if (messageToSpeak.trim() && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(messageToSpeak);
      speechSynthesis.speak(utterance);
      setMessageToSpeak('');
    }
  };

  const quickPhrases = [
    "Hello, this is [Your Name] calling.",
    "Can you please speak slowly?",
    "I'll text you the details.",
    "Thank you, have a great day!",
    "I need to end the call now.",
    "Could you repeat that please?"
  ];

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
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Phone size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Voice Calls</h1>
            <p className="text-gray-600">Make calls with AI-generated speech</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Call Interface */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Call Status */}
          <div className={`p-6 text-center ${isInCall ? 'bg-green-500' : 'bg-gray-100'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isInCall ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {isInCall ? (
                <Phone size={32} className="text-white" aria-hidden="true" />
              ) : (
                <User size={32} className="text-gray-400" aria-hidden="true" />
              )}
            </div>
            
            <h2 className={`text-xl font-semibold mb-2 ${isInCall ? 'text-white' : 'text-gray-900'}`}>
              {isInCall ? 'Connected' : 'Ready to Call'}
            </h2>
            
            {isInCall && (
              <div className={`flex items-center justify-center space-x-2 ${isInCall ? 'text-green-100' : 'text-gray-500'}`}>
                <Clock size={16} aria-hidden="true" />
                <span>{formatDuration(callDuration)}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={isInCall ? endCall : startCall}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 ${
                  isInCall
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                aria-label={isInCall ? 'End call' : 'Start call'}
              >
                {isInCall ? <PhoneOff size={24} aria-hidden="true" /> : <Phone size={24} aria-hidden="true" />}
              </button>
            </div>

            {/* Message Input */}
            <div className="space-y-4">
              <label htmlFor="call-message" className="block text-lg font-semibold text-gray-900">
                Message to Speak
              </label>
              <div className="flex space-x-3">
                <textarea
                  id="call-message"
                  value={messageToSpeak}
                  onChange={(e) => setMessageToSpeak(e.target.value)}
                  placeholder="Type what you want to say during the call..."
                  className="flex-1 h-24 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={!isInCall}
                />
                <button
                  onClick={speakMessage}
                  disabled={!messageToSpeak.trim() || !isInCall}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Speak message during call"
                >
                  <Volume2 size={20} aria-hidden="true" />
                  <span>Speak</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Phrases & Call History */}
        <div className="space-y-6">
          {/* Quick Phrases */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Call Phrases</h2>
            <div className="space-y-2">
              {quickPhrases.map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => setMessageToSpeak(phrase)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                  aria-label={`Use quick phrase: ${phrase}`}
                >
                  <span className="text-gray-900">{phrase}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Call History */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Calls</h2>
            <div className="space-y-3">
              {callHistory.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      call.type === 'incoming' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Phone size={16} className={call.type === 'incoming' ? 'text-green-600' : 'text-blue-600'} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.contact}</p>
                      <p className="text-sm text-gray-500">{call.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{call.duration}</p>
                    <p className="text-xs text-gray-500 capitalize">{call.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-8 bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">AI Voice Call Features</h3>
        <ul className="space-y-2 text-purple-800" role="list">
          <li>• Type messages that are spoken in real-time during calls</li>
          <li>• Choose from quick phrases for common call situations</li>
          <li>• AI voice adapts tone based on message content</li>
          <li>• Multilingual support for international calls</li>
          <li>• Conversation history automatically saved</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceCall;