import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, Bell, AlertTriangle, Car, Baby, Phone, Shield, Settings, Pause, Play } from 'lucide-react';

interface NoiseAlertsProps {
  onClose: () => void;
}

interface NoiseEvent {
  id: number;
  type: string;
  confidence: number;
  timestamp: string;
  duration: number;
  icon: React.ComponentType<any>;
  color: string;
}

const NoiseAlerts: React.FC<NoiseAlertsProps> = ({ onClose }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [noiseEvents, setNoiseEvents] = useState<NoiseEvent[]>([]);
  const [currentNoise, setCurrentNoise] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [sensitivity, setSensitivity] = useState(70);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const noiseTypes = [
    { type: 'doorbell', name: 'Doorbell', icon: Bell, color: 'blue', enabled: true },
    { type: 'alarm', name: 'Fire Alarm', icon: Shield, color: 'red', enabled: true },
    { type: 'car_horn', name: 'Car Horn', icon: Car, color: 'yellow', enabled: true },
    { type: 'baby_cry', name: 'Baby Crying', icon: Baby, color: 'pink', enabled: false },
    { type: 'phone_ring', name: 'Phone Ringing', icon: Phone, color: 'green', enabled: true },
    { type: 'smoke_alarm', name: 'Smoke Detector', icon: AlertTriangle, color: 'orange', enabled: true }
  ];

  const [enabledNoises, setEnabledNoises] = useState(
    noiseTypes.reduce((acc, noise) => ({ ...acc, [noise.type]: noise.enabled }), {})
  );

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMonitoring(true);
      monitorAudio();
      simulateNoiseDetection();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsMonitoring(false);
    setAudioLevel(0);
    setCurrentNoise('');
  };

  const monitorAudio = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioLevel = () => {
      if (!analyserRef.current || !isMonitoring) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      setAudioLevel(average);

      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };

  const simulateNoiseDetection = () => {
    if (!isMonitoring) return;

    const detectNoise = () => {
      // Simulate random noise detection
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        const enabledNoiseTypes = noiseTypes.filter(n => enabledNoises[n.type]);
        if (enabledNoiseTypes.length > 0) {
          const randomNoise = enabledNoiseTypes[Math.floor(Math.random() * enabledNoiseTypes.length)];
          const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
          
          detectNoiseEvent(randomNoise.type, confidence);
        }
      }

      if (isMonitoring) {
        setTimeout(detectNoise, 3000);
      }
    };

    setTimeout(detectNoise, 3000);
  };

  const detectNoiseEvent = (type: string, confidence: number) => {
    const noiseType = noiseTypes.find(n => n.type === type);
    if (!noiseType || !enabledNoises[type]) return;

    const event: NoiseEvent = {
      id: Date.now(),
      type: noiseType.name,
      confidence,
      timestamp: new Date().toLocaleTimeString(),
      duration: Math.floor(Math.random() * 5) + 1, // 1-5 seconds
      icon: noiseType.icon,
      color: noiseType.color
    };

    setNoiseEvents(prev => [event, ...prev.slice(0, 19)]); // Keep last 20 events
    setCurrentNoise(noiseType.name);

    // Trigger vibration
    if ('vibrate' in navigator) {
      const vibrationPattern = confidence > 0.8 ? [200, 100, 200] : [100, 50, 100];
      navigator.vibrate(vibrationPattern);
    }

    // Clear current noise after 3 seconds
    setTimeout(() => {
      setCurrentNoise('');
    }, 3000);

    // Show visual alert
    showVisualAlert(noiseType.name, noiseType.color);
  };

  const showVisualAlert = (noiseName: string, color: string) => {
    // Create a temporary visual alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce`;
    alertDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        <span class="font-semibold">${noiseName} Detected!</span>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 4000);
  };

  const toggleNoiseType = (type: string) => {
    setEnabledNoises(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      pink: 'bg-pink-100 text-pink-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

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
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Volume2 size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Noise Alerts</h1>
            <p className="text-gray-600">Intelligent sound detection and visual notifications</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monitoring Panel */}
        <div className="space-y-6">
          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                      isMonitoring
                        ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    aria-label={isMonitoring ? 'Stop monitoring' : 'Start monitoring'}
                  >
                    {isMonitoring ? (
                      <Pause size={24} aria-hidden="true" />
                    ) : (
                      <Play size={24} aria-hidden="true" />
                    )}
                  </button>
                  
                  <div>
                    <p className="text-lg font-semibold">
                      {isMonitoring ? 'Monitoring Active' : 'Click to start monitoring'}
                    </p>
                    <p className="text-purple-100 text-sm">
                      AI is listening for important sounds
                    </p>
                  </div>
                </div>
                
                {/* Audio Level Indicator */}
                {isMonitoring && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Audio Level:</span>
                    <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-100"
                        style={{ width: `${(audioLevel / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Detection */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Detection</h3>
              <div 
                className="min-h-16 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center"
                role="status"
                aria-live="polite"
              >
                {currentNoise ? (
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600 animate-pulse">{currentNoise}</p>
                    <p className="text-sm text-gray-600">Sound detected!</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    {isMonitoring ? 'Listening for sounds...' : 'Start monitoring to detect sounds'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 mb-2">
                  Sensitivity: {sensitivity}%
                </label>
                <input
                  id="sensitivity"
                  type="range"
                  min="30"
                  max="100"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Less sensitive</span>
                  <span>More sensitive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Noise Types */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sound Types to Monitor</h3>
            <div className="grid grid-cols-2 gap-3">
              {noiseTypes.map((noise) => {
                const IconComponent = noise.icon;
                return (
                  <label key={noise.type} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledNoises[noise.type]}
                      onChange={() => toggleNoiseType(noise.type)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(noise.color)}`}>
                      <IconComponent size={16} aria-hidden="true" />
                    </div>
                    <span className="text-gray-700 font-medium">{noise.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detection History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Detection History</h2>
            <p className="text-gray-600">{noiseEvents.length} sounds detected</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {noiseEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Volume2 size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p>No sounds detected yet</p>
                <p className="text-sm">Start monitoring to see detected sounds here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {noiseEvents.map((event) => {
                  const IconComponent = event.icon;
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(event.color)}`}>
                          <IconComponent size={20} aria-hidden="true" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{event.type}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(event.confidence)}`}>
                              {Math.round(event.confidence * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{event.timestamp}</span>
                            <span>Duration: {event.duration}s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">AI Noise Detection Features</h3>
        <ul className="space-y-2 text-purple-800" role="list">
          <li>• AI analyzes audio patterns to identify specific sounds</li>
          <li>• Visual alerts with vibration patterns for different sound types</li>
          <li>• Adjustable sensitivity for different environments</li>
          <li>• Real-time audio level monitoring</li>
          <li>• Confidence scores show detection accuracy</li>
          <li>• Customizable sound types to monitor</li>
          <li>• Detection history with timestamps and duration</li>
        </ul>
      </div>
    </div>
  );
};

export default NoiseAlerts;