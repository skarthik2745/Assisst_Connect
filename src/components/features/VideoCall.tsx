import React, { useState } from 'react';
import { ArrowLeft, Video, VideoOff, Mic, MicOff, Captions, Settings } from 'lucide-react';

interface VideoCallProps {
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ onClose }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [isInCall, setIsInCall] = useState(false);

  const mockCaptions = [
    "Hello, how are you doing today?",
    "I'm doing well, thank you for asking.",
    "That sounds like a great plan.",
    "Let me know if you need any help.",
    "Sure, I'll send you the details later."
  ];

  const [currentCaption, setCurrentCaption] = useState(0);

  React.useEffect(() => {
    if (isInCall && captionsEnabled) {
      const interval = setInterval(() => {
        setCurrentCaption((prev) => (prev + 1) % mockCaptions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInCall, captionsEnabled]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-6"
          aria-label="Go back to deaf portal"
        >
          <ArrowLeft size={24} aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Video size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Calls with Captions</h1>
            <p className="text-gray-600">Real-time captioning for video conversations</p>
          </div>
        </div>
      </div>

      {/* Video Interface */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Video Area */}
        <div className="relative bg-gray-900 aspect-video">
          {/* Mock Video Feed */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Video size={64} className="mx-auto mb-4 opacity-80" aria-hidden="true" />
                  <p className="text-xl font-medium">Video Call Active</p>
                  <p className="text-blue-100">Demo Mode</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <VideoOff size={64} className="mx-auto mb-4" aria-hidden="true" />
                  <p className="text-xl font-medium">Video Off</p>
                </div>
              </div>
            )}
          </div>

          {/* Self Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-white shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">You</span>
            </div>
          </div>

          {/* Live Captions */}
          {captionsEnabled && isInCall && (
            <div 
              className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg"
              role="region"
              aria-live="polite"
              aria-label="Live captions"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Captions size={16} aria-hidden="true" />
                <span className="text-xs uppercase tracking-wide">Live Captions</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                {mockCaptions[currentCaption]}
              </p>
            </div>
          )}

          {/* Call Status */}
          {isInCall && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isMicOn
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isMicOn ? <Mic size={20} aria-hidden="true" /> : <MicOff size={20} aria-hidden="true" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isVideoOn
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
              aria-label={isVideoOn ? 'Turn off video' : 'Turn on video'}
            >
              {isVideoOn ? <Video size={20} aria-hidden="true" /> : <VideoOff size={20} aria-hidden="true" />}
            </button>

            <button
              onClick={() => setIsInCall(!isInCall)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                isInCall
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              aria-label={isInCall ? 'End call' : 'Start call'}
            >
              {isInCall ? 'End Call' : 'Start Call'}
            </button>

            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                captionsEnabled
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
              aria-label={captionsEnabled ? 'Disable captions' : 'Enable captions'}
            >
              <Captions size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Caption Settings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Caption Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={captionsEnabled}
                    onChange={(e) => setCaptionsEnabled(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Enable live captions</span>
                </label>
                
                <div>
                  <label htmlFor="caption-size" className="block text-sm font-medium text-gray-700 mb-1">
                    Caption Size
                  </label>
                  <select 
                    id="caption-size"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium" selected>Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Audio Settings</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="noise-reduction" className="block text-sm font-medium text-gray-700 mb-1">
                    Noise Reduction
                  </label>
                  <select 
                    id="noise-reduction"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="off">Off</option>
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select 
                    id="language-select"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Video Call Features</h3>
        <ul className="space-y-2 text-green-800" role="list">
          <li>• Real-time captions appear automatically during calls</li>
          <li>• Captions support multiple languages and dialects</li>
          <li>• Visual indicators show when others are speaking</li>
          <li>• Save important conversation snippets</li>
          <li>• Adjustable caption size and positioning</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoCall;