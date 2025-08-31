import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, ArrowLeft, Copy, Download, Volume2, Globe, Zap } from 'lucide-react';
import { debounce, SpeechManager, AccessibilityUtils } from '../../utils/performance';

interface SpeechToTextProps {
  onClose: () => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      AccessibilityUtils.announce('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text:', err);
      AccessibilityUtils.announce('Failed to copy text');
    }
  }, [transcript]);

  const speakText = useCallback(async () => {
    if (transcript) {
      try {
        const speechManager = SpeechManager.getInstance();
        await speechManager.speak(transcript, { rate: 0.8, pitch: 1 });
        AccessibilityUtils.announce('Text spoken aloud');
      } catch (err) {
        console.error('Failed to speak text:', err);
        AccessibilityUtils.announce('Failed to speak text');
      }
    }
  }, [transcript]);

  return (
    <div className="max-w-4xl mx-auto">
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
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mic size={24} className="text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Speech-to-Text</h1>
            <p className="text-gray-600">Real-time conversation captioning</p>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Control Panel */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleListening}
                disabled={!isSupported}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg animate-pulse'
                    : 'bg-white/20 hover:bg-white/30'
                } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? (
                  <MicOff size={24} aria-hidden="true" />
                ) : (
                  <Mic size={24} aria-hidden="true" />
                )}
              </button>
              
              <div>
                <p className="text-lg font-semibold">
                  {isListening ? 'Listening...' : 'Click to start listening'}
                </p>
                <p className="text-blue-100 text-sm">
                  {isSupported ? 'Microphone ready' : 'Speech recognition not supported in this browser'}
                </p>
              </div>
            </div>
            
            {isListening && (
              <div className="flex space-x-2" aria-label="Audio level indicator">
                <div className="w-1 h-8 bg-white/60 rounded animate-pulse"></div>
                <div className="w-1 h-12 bg-white/80 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-6 bg-white/60 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-10 bg-white/80 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Area */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Live Transcript</h2>
            <div className="flex space-x-2">
              <button
                onClick={speakText}
                disabled={!transcript}
                className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Read transcript aloud"
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>Speak</span>
              </button>
              
              <button
                onClick={copyText}
                disabled={!transcript}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Copy transcript to clipboard"
              >
                <Copy size={16} aria-hidden="true" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          
          <div 
            className="min-h-64 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200"
            role="log"
            aria-live="polite"
            aria-label="Speech transcript"
          >
            {transcript ? (
              <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            ) : (
              <p className="text-gray-500 text-center italic">
                {isSupported 
                  ? 'Transcript will appear here when you start speaking...'
                  : 'Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.'
                }
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Globe size={20} className="text-blue-500" aria-hidden="true" />
              <span>Multilingual support</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Zap size={20} className="text-purple-500" aria-hidden="true" />
              <span>AI noise filtering</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Download size={20} className="text-green-500" aria-hidden="true" />
              <span>Export transcripts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
        <ul className="space-y-2 text-blue-800" role="list">
          <li>• Click the microphone button to start listening</li>
          <li>• Speak naturally - the system will transcribe in real-time</li>
          <li>• Use the "Speak" button to have the system read text aloud</li>
          <li>• Copy transcripts to share with others</li>
          <li>• The system filters background noise automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeechToText;