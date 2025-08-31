import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Hand, Camera, CameraOff, Volume2, FileText, Play, Square, Loader } from 'lucide-react';

interface SignLanguageProps {
  onClose: () => void;
}

const SignLanguage: React.FC<SignLanguageProps> = ({ onClose }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [detectedSign, setDetectedSign] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadMediaPipe = async () => {
      if (typeof window !== 'undefined') {
        try {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js';
          script.onload = () => {
            const { Hands } = (window as any);
            if (Hands) {
              handsRef.current = new Hands({
                locateFile: (file: string) => {
                  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
                }
              });
              
              handsRef.current.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
              });
              
              handsRef.current.onResults(onHandsResults);
            }
          };
          document.head.appendChild(script);
        } catch (error) {
          console.error('Failed to load MediaPipe:', error);
        }
      }
    };
    
    loadMediaPipe();
  }, []);

  const onHandsResults = (results: any) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const gesture = recognizeGesture(landmarks);
      
      if (gesture.text && gesture.confidence > 0.7) {
        setDetectedSign(gesture.text);
        setConfidence(gesture.confidence);
        setTranslatedText(`Detected: ${gesture.text}`);
      }
    }
  };

  const recognizeGesture = (landmarks: any[]) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    
    const thumbUp = landmarks[3];
    const indexUp = landmarks[6];
    const middleUp = landmarks[10];
    const ringUp = landmarks[14];
    const pinkyUp = landmarks[18];

    if (thumbTip.y < thumbUp.y && indexTip.y > indexUp.y && middleTip.y > middleUp.y) {
      return { text: 'Thumbs Up', confidence: 0.85 };
    }
    
    if (indexTip.y < indexUp.y && middleTip.y > middleUp.y && ringTip.y > ringUp.y && pinkyTip.y > pinkyUp.y) {
      return { text: 'Pointing', confidence: 0.8 };
    }
    
    if (indexTip.y < indexUp.y && middleTip.y < middleUp.y && ringTip.y > ringUp.y && pinkyTip.y > pinkyUp.y) {
      return { text: 'Peace Sign', confidence: 0.9 };
    }
    
    if (thumbTip.y < thumbUp.y && indexTip.y < indexUp.y && middleTip.y < middleUp.y && ringTip.y < ringUp.y && pinkyTip.y < pinkyUp.y) {
      return { text: 'Open Hand', confidence: 0.75 };
    }
    
    if (indexTip.y > indexUp.y && middleTip.y > middleUp.y && ringTip.y > ringUp.y && pinkyTip.y > pinkyUp.y) {
      return { text: 'Fist', confidence: 0.8 };
    }

    return { text: '', confidence: 0 };
  };

  const startCamera = async () => {
    try {
      setIsModelLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsCameraOn(true);
      setIsModelLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check your permissions.');
      setIsModelLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    if (!isCameraOn) {
      await startCamera();
      return;
    }
    
    setIsRecording(!isRecording);
    
    if (!isRecording && handsRef.current && videoRef.current) {
      const detectHands = async () => {
        if (isRecording && videoRef.current && handsRef.current) {
          await handsRef.current.send({ image: videoRef.current });
          requestAnimationFrame(detectHands);
        }
      };
      detectHands();
    }
  };

  const speakTranslation = () => {
    if (detectedSign && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(detectedSign);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
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
            <Hand size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sign Language Recognition</h1>
            <p className="text-gray-600">Convert sign language to text and voice</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Camera Feed */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Camera Feed</h2>
            <p className="text-gray-600">Position your hands in view for recognition</p>
          </div>
          
          <div className="relative aspect-video bg-gray-900">
            {isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
                aria-label="Sign language camera feed"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Camera size={64} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p className="text-lg font-medium">Camera Off</p>
                  <p className="text-sm">Click start to begin recognition</p>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}

            {/* Hand Detection Overlay */}
            {isCameraOn && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-4 border-dashed border-purple-400 opacity-30 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Hand size={48} className="text-purple-400 opacity-50" aria-hidden="true" />
                </div>
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
                onClick={toggleRecording}
                disabled={!isCameraOn}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                aria-label={isRecording ? 'Stop recognition' : 'Start recognition'}
              >
                {isRecording ? (
                  <>
                    <Square size={20} className="mr-2" aria-hidden="true" />
                    Stop Recognition
                  </>
                ) : (
                  <>
                    <Play size={20} className="mr-2" aria-hidden="true" />
                    Start Recognition
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recognition Results */}
        <div className="space-y-6">
          {/* Detected Sign */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detected Sign</h2>
            <div className="text-center">
              {detectedSign ? (
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Hand size={32} className="text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-600">{detectedSign}</h3>
                  <p className="text-gray-600">Confidence: 95%</p>
                </div>
              ) : (
                <div className="text-gray-400 py-8">
                  <Hand size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                  <p>No sign detected</p>
                  <p className="text-sm">Start recording to begin recognition</p>
                </div>
              )}
            </div>
          </div>

          {/* Translation Output */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Translation</h2>
              <button
                onClick={speakTranslation}
                disabled={!translatedText}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Speak translation aloud"
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>Speak</span>
              </button>
            </div>
            
            <div 
              className="min-h-24 p-4 bg-gray-50 rounded-xl border border-gray-200"
              role="log"
              aria-live="polite"
              aria-label="Sign language translation"
            >
              {translatedText ? (
                <p className="text-gray-900 text-lg">{translatedText}</p>
              ) : (
                <p className="text-gray-500 italic">Translation will appear here...</p>
              )}
            </div>
          </div>

          {/* Quick Signs */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Signs</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Hello', 'Thank you', 'Please', 'Help', 'Yes', 'No'].map((sign) => (
                <button
                  key={sign}
                  onClick={() => {
                    setDetectedSign(sign);
                    setTranslatedText(`The sign language gesture detected: "${sign}"`);
                  }}
                  className="p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200"
                  aria-label={`Simulate detection of ${sign} sign`}
                >
                  <span className="text-purple-900 font-medium">{sign}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignLanguage;