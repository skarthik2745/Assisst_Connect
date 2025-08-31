import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Command, Copy, Trash2, Settings } from 'lucide-react';

interface VoiceCommandsProps {
  onClose: () => void;
}

interface Command {
  id: number;
  voice: string;
  text: string;
  timestamp: string;
  confidence: number;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            
            // Process as command
            const command: Command = {
              id: Date.now(),
              voice: transcript,
              text: processVoiceCommand(transcript),
              timestamp: new Date().toLocaleTimeString(),
              confidence: confidence || 0.95
            };
            
            setCommands(prev => [command, ...prev]);
            setCurrentCommand('');
          } else {
            interimTranscript += transcript;
            setCurrentCommand(interimTranscript);
          }
        }
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
  }, [language]);

  const processVoiceCommand = (voiceInput: string): string => {
    const input = voiceInput.toLowerCase().trim();
    
    // Command patterns and their text equivalents
    const commandPatterns = [
      { pattern: /call (.*)/i, template: 'Call $1' },
      { pattern: /send message to (.*) saying (.*)/i, template: 'Send message to $1: "$2"' },
      { pattern: /open (.*)/i, template: 'Open $1 application' },
      { pattern: /search for (.*)/i, template: 'Search: $1' },
      { pattern: /set reminder (.*)/i, template: 'Reminder: $1' },
      { pattern: /navigate to (.*)/i, template: 'Navigate to $1' },
      { pattern: /turn on (.*)/i, template: 'Turn on $1' },
      { pattern: /turn off (.*)/i, template: 'Turn off $1' },
      { pattern: /play (.*)/i, template: 'Play $1' },
      { pattern: /stop (.*)/i, template: 'Stop $1' },
      { pattern: /help with (.*)/i, template: 'Need help with $1' },
      { pattern: /emergency (.*)/i, template: '🚨 EMERGENCY: $1' }
    ];

    // Check for command patterns
    for (const { pattern, template } of commandPatterns) {
      const match = input.match(pattern);
      if (match) {
        let result = template;
        for (let i = 1; i < match.length; i++) {
          result = result.replace(`$${i}`, match[i]);
        }
        return result;
      }
    }

    // If no pattern matches, return as instruction
    return `Instruction: ${voiceInput}`;
  };

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

  const copyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteCommand = (id: number) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
  };

  const clearAllCommands = () => {
    setCommands([]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Command size={24} className="text-orange-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Commands to Text</h1>
            <p className="text-gray-600">Convert spoken commands into readable instructions</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Voice Input Panel */}
        <div className="space-y-6">
          {/* Listening Interface */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
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
                      {isListening ? 'Listening for commands...' : 'Click to start listening'}
                    </p>
                    <p className="text-orange-100 text-sm">
                      {isSupported ? 'Microphone ready' : 'Speech recognition not supported'}
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

            {/* Current Command */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Input</h3>
              <div 
                className="min-h-16 p-4 bg-gray-50 rounded-xl border border-gray-200"
                role="log"
                aria-live="polite"
                aria-label="Current voice input"
              >
                {currentCommand ? (
                  <p className="text-gray-900 text-lg italic">{currentCommand}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    {isSupported 
                      ? 'Speak a command and it will appear here...'
                      : 'Speech recognition is not supported in this browser.'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select 
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="zh-CN">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Command Examples */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Commands</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium text-orange-900">"Call John Smith"</p>
                <p className="text-orange-700">→ Call John Smith</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium text-orange-900">"Send message to Mom saying I'll be late"</p>
                <p className="text-orange-700">→ Send message to Mom: "I'll be late"</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="font-medium text-orange-900">"Set reminder doctor appointment tomorrow"</p>
                <p className="text-orange-700">→ Reminder: doctor appointment tomorrow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commands History */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Command History</h2>
                <p className="text-gray-600">{commands.length} commands processed</p>
              </div>
              {commands.length > 0 && (
                <button
                  onClick={clearAllCommands}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  aria-label="Clear all commands"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {commands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Command size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                <p>No commands yet</p>
                <p className="text-sm">Start speaking to see your commands here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {commands.map((command) => (
                  <div key={command.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(command.confidence)}`}>
                            {Math.round(command.confidence * 100)}% confident
                          </span>
                          <span className="text-xs text-gray-500">{command.timestamp}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Voice Input:</p>
                            <p className="text-gray-800 italic">"{command.voice}"</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Processed Command:</p>
                            <p className="text-gray-900 font-medium">{command.text}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => copyCommand(command.text)}
                          className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                          aria-label={`Copy command: ${command.text}`}
                        >
                          <Copy size={14} className="text-blue-600" aria-hidden="true" />
                        </button>
                        
                        <button
                          onClick={() => deleteCommand(command.id)}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                          aria-label={`Delete command: ${command.text}`}
                        >
                          <Trash2 size={14} className="text-red-600" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-orange-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">How Voice Commands Work</h3>
        <ul className="space-y-2 text-orange-800" role="list">
          <li>• Speak naturally - the system recognizes common command patterns</li>
          <li>• Commands are converted to clear, readable text instructions</li>
          <li>• Confidence levels show how accurately the system understood you</li>
          <li>• Copy processed commands to share with others or use in apps</li>
          <li>• Supports multiple languages and accents</li>
          <li>• Emergency commands are highlighted for quick identification</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceCommands;