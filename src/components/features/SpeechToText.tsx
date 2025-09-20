import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, ArrowLeft, Copy, Download, Volume2, Globe, Zap } from 'lucide-react';
import { debounce, SpeechManager, AccessibilityUtils } from '../../utils/performance';
import { useSpeechSessions } from '../../hooks/useSupabase';

interface SpeechToTextProps {
  onClose: () => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { saveSession } = useSpeechSessions();

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            // Save final transcript to database
            if (transcript.trim()) {
              await saveSession(transcript.trim(), confidence || 0.9);
            }
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
          className="nav-item flex items-center space-x-2 mr-6"
          aria-label="Go back to deaf portal"
        >
          <ArrowLeft size={24} className="icon-cyan" aria-hidden="true" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'rgba(0, 229, 255, 0.2)', border: '2px solid var(--neon-cyan)'}}>
            <Mic size={24} className="icon-cyan" aria-hidden="true" />
          </div>
          <div>
            <h1 className="heading-text text-3xl">Speech-to-Text</h1>
            <p className="paragraph-text">Real-time conversation captioning</p>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="glass-card overflow-hidden">
        {/* Control Panel */}
        <div className="p-6 text-white" style={{background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))'}}>
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
            <h2 className="heading-text-green text-xl">Live Transcript</h2>
            <div className="flex space-x-2">
              <button
                onClick={speakText}
                disabled={!transcript}
                className="btn-neon-green flex items-center space-x-2 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Read transcript aloud"
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>Speak</span>
              </button>
              
              <button
                onClick={copyText}
                disabled={!transcript}
                className="btn-secondary flex items-center space-x-2 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Copy transcript to clipboard"
              >
                <Copy size={16} aria-hidden="true" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          
          <div 
            className="min-h-64 max-h-96 overflow-y-auto p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 229, 255, 0.3)'
            }}
            role="log"
            aria-live="polite"
            aria-label="Speech transcript"
          >
            {transcript ? (
              <p className="subheading-text text-lg leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            ) : (
              <p className="paragraph-text text-center italic">
                {isSupported 
                  ? 'Transcript will appear here when you start speaking...'
                  : 'Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.'
                }
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="p-6" style={{borderTop: '1px solid rgba(0, 229, 255, 0.2)', background: 'rgba(0, 229, 255, 0.05)'}}>
          <h3 className="heading-text-pink text-lg mb-4">Additional Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 subheading-text">
              <Globe size={20} className="icon-blue" aria-hidden="true" />
              <span>Multilingual support</span>
            </div>
            <div className="flex items-center space-x-3 subheading-text">
              <Zap size={20} className="icon-violet" aria-hidden="true" />
              <span>AI noise filtering</span>
            </div>
            <div className="flex items-center space-x-3 subheading-text">
              <Download size={20} className="icon-green" aria-hidden="true" />
              <span>Export transcripts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 glass-card-green p-6">
        <h3 className="heading-text-green text-lg mb-3">How to Use</h3>
        <ul className="space-y-2 subheading-text" role="list">
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