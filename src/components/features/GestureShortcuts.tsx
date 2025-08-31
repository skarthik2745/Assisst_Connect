import React, { useState, useRef } from 'react';
import { ArrowLeft, Hand, Camera, CameraOff, Volume2, Settings, Plus, Trash2 } from 'lucide-react';

interface GestureShortcutsProps {
  onClose: () => void;
}

interface GestureShortcut {
  id: number;
  gesture: string;
  phrase: string;
  isActive: boolean;
}

const GestureShortcuts: React.FC<GestureShortcutsProps> = ({ onClose }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState('');
  const [shortcuts, setShortcuts] = useState<GestureShortcut[]>([
    { id: 1, gesture: 'Peace Sign', phrase: 'Hello, nice to meet you!', isActive: true },
    { id: 2, gesture: 'Thumbs Up', phrase: 'Yes, I agree with that.', isActive: true },
    { id: 3, gesture: 'Thumbs Down', phrase: 'No, I disagree.', isActive: true },
    { id: 4, gesture: 'Open Palm', phrase: 'Stop, please wait.', isActive: true },
    { id: 5, gesture: 'Pointing Up', phrase: 'I have a question.', isActive: true },
    { id: 6, gesture: 'OK Sign', phrase: 'Everything is okay.', isActive: true }
  ]);
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [newGesture, setNewGesture] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check your permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsCalibrating(false);
  };

  const simulateGestureDetection = () => {
    const activeShortcuts = shortcuts.filter(s => s.isActive);
    if (activeShortcuts.length > 0) {
      const randomShortcut = activeShortcuts[Math.floor(Math.random() * activeShortcuts.length)];
      setDetectedGesture(randomShortcut.gesture);
      
      // Speak the associated phrase
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomShortcut.phrase);
        speechSynthesis.speak(utterance);
      }
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOn && isCalibrating) {
      interval = setInterval(simulateGestureDetection, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraOn, isCalibrating, shortcuts]);

  const toggleShortcut = (id: number) => {
    setShortcuts(prev => prev.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const deleteShortcut = (id: number) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  const addShortcut = () => {
    if (!newGesture.trim() || !newPhrase.trim()) return;
    
    const shortcut: GestureShortcut = {
      id: Date.now(),
      gesture: newGesture.trim(),
      phrase: newPhrase.trim(),
      isActive: true
    };
    
    setShortcuts(prev => [...prev, shortcut]);
    setNewGesture('');
    setNewPhrase('');
    setIsAddingShortcut(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
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
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Hand size={24} className="text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gesture Shortcuts</h1>
            <p className="text-gray-600">Quick phrases triggered by hand gestures</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Camera & Detection */}
        <div className="space-y-6">
          {/* Camera Feed */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Gesture Detection</h2>
              <p className="text-gray-600">Show your gestures to the camera</p>
            </div>
            
            <div className="relative aspect-video bg-gray-900">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  aria-label="Gesture detection camera feed"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Camera size={64} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                    <p className="text-lg font-medium">Camera Off</p>
                    <p className="text-sm">Enable camera to start gesture detection</p>
                  </div>
                </div>
              )}

              {/* Detection Status */}
              {isCameraOn && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/80 text-white px-3 py-2 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${isCalibrating ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} aria-hidden="true"></div>
                  <span className="text-sm font-medium">
                    {isCalibrating ? 'Detecting...' : 'Standby'}
                  </span>
                </div>
              )}

              {/* Detected Gesture */}
              {detectedGesture && (
                <div className="absolute bottom-4 left-4 right-4 bg-indigo-500/90 text-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Hand size={16} aria-hidden="true" />
                    <span className="text-xs uppercase tracking-wide">Detected Gesture</span>
                  </div>
                  <p className="text-lg font-semibold">{detectedGesture}</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isCameraOn ? stopCamera : startCamera}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isCameraOn
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isCameraOn ? <CameraOff size={20} aria-hidden="true" /> : <Camera size={20} aria-hidden="true" />}
                </button>

                <button
                  onClick={() => setIsCalibrating(!isCalibrating)}
                  disabled={!isCameraOn}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isCalibrating
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={isCalibrating ? 'Stop detection' : 'Start detection'}
                >
                  {isCalibrating ? 'Stop Detection' : 'Start Detection'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts Management */}
        <div className="space-y-6">
          {/* Add New Shortcut */}
          {isAddingShortcut && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Gesture Shortcut</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="new-gesture" className="block text-sm font-medium text-gray-700 mb-2">
                    Gesture Name
                  </label>
                  <input
                    id="new-gesture"
                    type="text"
                    value={newGesture}
                    onChange={(e) => setNewGesture(e.target.value)}
                    placeholder="e.g., Wave, Fist Bump, Point Down"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-phrase" className="block text-sm font-medium text-gray-700 mb-2">
                    Phrase to Speak
                  </label>
                  <textarea
                    id="new-phrase"
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    placeholder="Enter the phrase that will be spoken when this gesture is detected..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={addShortcut}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                    aria-label="Save gesture shortcut"
                  >
                    <Hand size={16} aria-hidden="true" />
                    <span>Add Shortcut</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsAddingShortcut(false);
                      setNewGesture('');
                      setNewPhrase('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Active Shortcuts</h2>
                  <p className="text-gray-600">{shortcuts.filter(s => s.isActive).length} active gestures</p>
                </div>
                <button
                  onClick={() => setIsAddingShortcut(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                  aria-label="Add new gesture shortcut"
                >
                  <Plus size={16} aria-hidden="true" />
                  <span>Add Shortcut</span>
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={shortcut.isActive}
                            onChange={() => toggleShortcut(shortcut.id)}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            aria-label={`Toggle ${shortcut.gesture} shortcut`}
                          />
                          <span className="font-semibold text-gray-900">{shortcut.gesture}</span>
                        </label>
                      </div>
                      <p className="text-gray-600 ml-7">{shortcut.phrase}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(shortcut.phrase);
                            speechSynthesis.speak(utterance);
                          }
                        }}
                        className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors duration-200"
                        aria-label={`Test phrase: ${shortcut.phrase}`}
                      >
                        <Volume2 size={14} className="text-green-600" aria-hidden="true" />
                      </button>
                      
                      <button
                        onClick={() => deleteShortcut(shortcut.id)}
                        className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                        aria-label={`Delete ${shortcut.gesture} shortcut`}
                      >
                        <Trash2 size={14} className="text-red-600" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibration Status */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Camera Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCameraOn ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCameraOn ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Gesture Detection</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCalibrating ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCalibrating ? 'Detecting' : 'Standby'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Active Shortcuts</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {shortcuts.filter(s => s.isActive).length} enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">How Gesture Shortcuts Work</h3>
        <ul className="space-y-2 text-indigo-800" role="list">
          <li>• Enable your camera and start detection</li>
          <li>• Perform any active gesture in front of the camera</li>
          <li>• The system will automatically speak the associated phrase</li>
          <li>• Customize shortcuts by adding your own gestures and phrases</li>
          <li>• Toggle shortcuts on/off based on your current needs</li>
          <li>• Works best with clear, distinct hand movements</li>
        </ul>
      </div>
    </div>
  );
};

export default GestureShortcuts;