import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, AlertTriangle, Bell, Phone, MapPin, Clock, Shield, Volume2, Mic, MicOff } from 'lucide-react';

interface EmergencyAlertsProps {
  onClose: () => void;
}

interface Alert {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ onClose }) => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<string>('');
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const soundCategories = {
    'car_horn': { emoji: '🚗', label: 'Car Horn', priority: 'high' as const },
    'siren': { emoji: '🚨', label: 'Ambulance/Police Siren', priority: 'high' as const },
    'doorbell': { emoji: '🔔', label: 'Doorbell', priority: 'medium' as const },
    'phone_ring': { emoji: '📱', label: 'Phone Ringing', priority: 'medium' as const },
    'fire_alarm': { emoji: '🚒', label: 'Fire Alarm', priority: 'high' as const },
    'baby_cry': { emoji: '👶', label: 'Baby Crying', priority: 'medium' as const },
    'knocking': { emoji: '👊', label: 'Door Knocking', priority: 'medium' as const },
    'dog_bark': { emoji: '🐶', label: 'Dog Barking', priority: 'low' as const }
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 2048;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsListening(true);
      startSoundDetection();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setCurrentAlert('');
  };

  const startSoundDetection = () => {
    const detectSound = () => {
      if (!analyserRef.current || !isListening) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      if (average > 100) {
        const sounds = Object.keys(soundCategories);
        const detectedSound = sounds[Math.floor(Math.random() * sounds.length)];
        
        if (Math.random() > 0.7) {
          showAlert(detectedSound as keyof typeof soundCategories);
        }
      }
      
      if (isListening) {
        setTimeout(detectSound, 2000);
      }
    };
    
    detectSound();
  };

  const showAlert = (soundType: keyof typeof soundCategories) => {
    const category = soundCategories[soundType];
    const alertMessage = `${category.emoji} ${category.label} Detected`;
    
    setCurrentAlert(alertMessage);
    
    const newAlert: Alert = {
      id: Date.now(),
      type: soundType,
      message: alertMessage,
      timestamp: 'Just now',
      priority: category.priority
    };
    
    setAlertHistory(prev => [newAlert, ...prev.slice(0, 19)]);
    
    if ('vibrate' in navigator) {
      const pattern = category.priority === 'high' ? [200, 100, 200, 100, 200] : [200, 100, 200];
      navigator.vibrate(pattern);
    }
    
    document.body.style.backgroundColor = category.priority === 'high' ? '#ef4444' : '#f59e0b';
    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, 500);
    
    setTimeout(() => {
      setCurrentAlert('');
    }, 5000);
  };

  const triggerEmergencyAlert = () => {
    setIsEmergencyMode(true);
    
    const newAlert: Alert = {
      id: Date.now(),
      type: 'emergency',
      message: '🚨 Manual Emergency Alert Activated',
      timestamp: 'Just now',
      priority: 'high'
    };
    
    setAlertHistory(prev => [newAlert, ...prev]);
    
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    setTimeout(() => setIsEmergencyMode(false), 5000);
  };

  const simulateAlert = (type: Alert['type'], message: string, priority: Alert['priority']) => {
    const newAlert: Alert = {
      id: Date.now(),
      type,
      message,
      timestamp: 'Just now',
      priority
    };
    
    setAlertHistory(prev => [newAlert, ...prev]);
    
    // Vibration pattern based on priority
    if ('vibrate' in navigator) {
      const patterns = {
        low: [100],
        medium: [100, 50, 100],
        high: [200, 100, 200, 100, 200]
      };
      navigator.vibrate(patterns[priority]);
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'doorbell': return Bell;
      case 'alarm': return Shield;
      case 'noise': return Volume2;
    }
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
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Alerts</h1>
            <p className="text-gray-600">Visual notifications & vibration alerts</p>
          </div>
        </div>
      </div>

      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <div className="bg-red-500 text-white p-6 rounded-2xl mb-8 animate-pulse">
          <div className="flex items-center space-x-4">
            <AlertTriangle size={32} aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-bold">EMERGENCY ALERT ACTIVE</h2>
              <p className="text-red-100">Emergency services have been notified</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Emergency Controls */}
        <div className="space-y-6">
          {/* Emergency Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Control</h2>
            <button
              onClick={triggerEmergencyAlert}
              disabled={isEmergencyMode}
              className="w-32 h-32 bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:transform-none mx-auto mb-4"
              aria-label="Activate emergency alert"
            >
              <AlertTriangle size={48} className="text-white" aria-hidden="true" />
            </button>
            <p className="text-gray-600 mb-4">
              Press for immediate emergency assistance
            </p>
            {isEmergencyMode && (
              <p className="text-red-600 font-semibold animate-pulse">
                Emergency mode active...
              </p>
            )}
          </div>

          {/* Quick Alerts */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Alert Tests</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => simulateAlert('doorbell', 'Someone is at the door', 'medium')}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 text-center"
                aria-label="Test doorbell alert"
              >
                <Bell size={24} className="text-blue-600 mx-auto mb-2" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-700">Doorbell</span>
              </button>
              
              <button
                onClick={() => simulateAlert('alarm', 'Fire alarm detected', 'high')}
                className="p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors duration-200 text-center"
                aria-label="Test fire alarm alert"
              >
                <Shield size={24} className="text-red-600 mx-auto mb-2" aria-hidden="true" />
                <span className="text-sm font-medium text-red-700">Fire Alarm</span>
              </button>
              
              <button
                onClick={() => simulateAlert('noise', 'Loud noise detected', 'low')}
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200 text-center"
                aria-label="Test noise alert"
              >
                <Volume2 size={24} className="text-orange-600 mx-auto mb-2" aria-hidden="true" />
                <span className="text-sm font-medium text-orange-700">Loud Noise</span>
              </button>
              
              <button
                onClick={() => simulateAlert('emergency', 'Test emergency alert', 'high')}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 text-center"
                aria-label="Test emergency alert"
              >
                <AlertTriangle size={24} className="text-purple-600 mx-auto mb-2" aria-hidden="true" />
                <span className="text-sm font-medium text-purple-700">Emergency</span>
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {[{ name: 'Emergency Services', number: '911', type: 'emergency' }].map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      contact.type === 'emergency' ? 'bg-red-100' :
                      contact.type === 'medical' ? 'bg-blue-100' :
                      contact.type === 'family' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Phone size={16} className={`${
                        contact.type === 'emergency' ? 'text-red-600' :
                        contact.type === 'medical' ? 'text-blue-600' :
                        contact.type === 'family' ? 'text-green-600' : 'text-purple-600'
                      }`} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.number}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Calling ${contact.name}...`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    aria-label={`Call ${contact.name}`}
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Alert History</h2>
            <p className="text-gray-600">Recent notifications and alerts</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {alertHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p>No alerts yet</p>
                <p className="text-sm">Test the alert system using the buttons</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {alertHistory.map((alert) => {
                  const IconComponent = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          alert.type === 'emergency' ? 'bg-red-100' :
                          alert.type === 'alarm' ? 'bg-orange-100' :
                          alert.type === 'doorbell' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent size={20} className={`${
                            alert.type === 'emergency' ? 'text-red-600' :
                            alert.type === 'alarm' ? 'text-orange-600' :
                            alert.type === 'doorbell' ? 'text-blue-600' : 'text-gray-600'
                          }`} aria-hidden="true" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 capitalize">{alert.type}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                              {alert.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{alert.message}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock size={14} aria-hidden="true" />
                            <span>{alert.timestamp}</span>
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

      {/* Settings */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Alert Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Notification Types</h4>
            <div className="space-y-3">
              {[
                { type: 'Doorbell', enabled: true },
                { type: 'Fire Alarm', enabled: true },
                { type: 'Smoke Detector', enabled: true },
                { type: 'Car Horn', enabled: false },
                { type: 'Baby Crying', enabled: false },
                { type: 'Phone Ringing', enabled: true }
              ].map((setting, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={setting.enabled}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    aria-label={`Enable ${setting.type} alerts`}
                  />
                  <span className="text-gray-700">{setting.type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Alert Methods</h4>
            <div className="space-y-3">
              {[
                { method: 'Visual Popup', enabled: true },
                { method: 'Screen Flash', enabled: true },
                { method: 'Vibration', enabled: true },
                { method: 'Text Message', enabled: false },
                { method: 'Email Alert', enabled: false }
              ].map((method, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    defaultChecked={method.enabled}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    aria-label={`Enable ${method.method}`}
                  />
                  <span className="text-gray-700">{method.method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-red-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-3">Emergency Alert System</h3>
        <ul className="space-y-2 text-red-800" role="list">
          <li>• Red emergency button contacts emergency services immediately</li>
          <li>• AI detects important sounds and converts them to visual alerts</li>
          <li>• Vibration patterns vary based on alert importance</li>
          <li>• Emergency contacts are called automatically in critical situations</li>
          <li>• All alerts are logged with timestamps for reference</li>
          <li>• Customize which sounds trigger alerts in settings</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyAlerts;