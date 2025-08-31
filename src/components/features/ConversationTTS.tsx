import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, MessageCircle, Send, Trash2, Save, Settings } from 'lucide-react';

interface ConversationTTSProps {
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isSpoken: boolean;
}

const ConversationTTS: React.FC<ConversationTTSProps> = ({ onClose }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English female voice)
      const defaultVoice = availableVoices.find(v => 
        v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
      ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      setVoice(defaultVoice);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (text: string, messageId?: number) => {
    if (!text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (messageId) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isSpoken: true } : msg
        ));
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: currentMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
      isSpoken: false
    };

    setMessages(prev => [...prev, message]);

    // Auto-speak if enabled
    if (autoSpeak) {
      speakMessage(currentMessage.trim(), message.id);
    }

    setCurrentMessage('');
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearMessages = () => {
    setMessages([]);
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const saveConversation = () => {
    const conversationText = messages.map(msg => 
      `[${msg.timestamp}] ${msg.text}`
    ).join('\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const quickPhrases = [
    "Hello, how are you today?",
    "Thank you for your patience.",
    "I need some help, please.",
    "Could you repeat that?",
    "I understand.",
    "Let me think about that.",
    "That sounds good to me.",
    "I'll get back to you soon.",
    "Have a great day!",
    "Nice to meet you."
  ];

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
            <MessageCircle size={24} className="text-green-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversation Text-to-Speech</h1>
            <p className="text-gray-600">Type messages and have them spoken aloud</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Conversation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Messages Display */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Conversation</h2>
                  <p className="text-green-100">{messages.length} messages</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoSpeak}
                      onChange={(e) => setAutoSpeak(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span>Auto-speak</span>
                  </label>
                  
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
                      aria-label="Stop speaking"
                    >
                      <VolumeX size={16} aria-hidden="true" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                  <p>No messages yet</p>
                  <p className="text-sm">Type a message below to start the conversation</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={16} className="text-blue-600" aria-hidden="true" />
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          {message.isSpoken && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Spoken
                            </span>
                          )}
                          <button
                            onClick={() => speakMessage(message.text, message.id)}
                            disabled={isSpeaking}
                            className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
                            aria-label={`Speak message: ${message.text}`}
                          >
                            <Volume2 size={14} className="text-green-600" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-900">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Type Your Message</h3>
              <div className="flex space-x-2">
                {messages.length > 0 && (
                  <>
                    <button
                      onClick={saveConversation}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      aria-label="Save conversation"
                    >
                      <Save size={16} aria-hidden="true" />
                      <span>Save</span>
                    </button>
                    
                    <button
                      onClick={clearMessages}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      aria-label="Clear conversation"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Clear</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="flex-1 h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label="Message input"
              />
              
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isSpeaking}
                className="px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                aria-label="Send message"
              >
                <Send size={20} aria-hidden="true" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Voice Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Voice
                </label>
                <select
                  id="voice-select"
                  value={voice?.name || ''}
                  onChange={(e) => {
                    const selectedVoice = voices.find(v => v.name === e.target.value);
                    setVoice(selectedVoice || null);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {rate.toFixed(1)}x
                </label>
                <input
                  id="rate-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch: {pitch.toFixed(1)}
                </label>
                <input
                  id="pitch-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="volume-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Phrases */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Phrases</h3>
            <div className="space-y-2">
              {quickPhrases.map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(phrase)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                  aria-label={`Use quick phrase: ${phrase}`}
                >
                  <span className="text-gray-900 text-sm">{phrase}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibent text-green-900 mb-3">Conversation Features</h3>
        <ul className="space-y-2 text-green-800" role="list">
          <li>• Type messages and have them spoken aloud automatically</li>
          <li>• Adjust voice, speed, pitch, and volume to your preference</li>
          <li>• Use quick phrases for common expressions</li>
          <li>• Save conversation history for future reference</li>
          <li>• Press Enter to send messages quickly</li>
          <li>• Perfect for face-to-face conversations where you need to communicate verbally</li>
        </ul>
      </div>
    </div>
  );
};

export default ConversationTTS;