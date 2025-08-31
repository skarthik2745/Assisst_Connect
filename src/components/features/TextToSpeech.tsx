import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, ArrowLeft, Save, Settings, Mic } from 'lucide-react';

interface TextToSpeechProps {
  onClose: () => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English)
      const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
      setVoice(defaultVoice);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = () => {
    if (!text.trim()) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const savePhrase = () => {
    if (!text.trim()) return;
    
    // In a real app, this would save to local storage or database
    const savedPhrases = JSON.parse(localStorage.getItem('savedPhrases') || '[]');
    savedPhrases.push({
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('savedPhrases', JSON.stringify(savedPhrases));
    
    // Show success feedback
    alert('Phrase saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
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
            <Volume2 size={24} className="text-purple-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Text-to-Speech</h1>
            <p className="text-gray-600">Convert your text to natural speech</p>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Input Area */}
        <div className="p-6 border-b border-gray-200">
          <label htmlFor="speech-text" className="block text-lg font-semibold text-gray-900 mb-3">
            Type your message:
          </label>
          <textarea
            id="speech-text"
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to speak aloud..."
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg leading-relaxed"
            aria-describedby="speech-help"
          />
          <p id="speech-help" className="text-sm text-gray-500 mt-2">
            Tip: Use punctuation for natural pauses and emphasis.
          </p>
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={speak}
              disabled={!text.trim()}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                isSpeaking
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={24} aria-hidden="true" />
                  <span>Stop Speaking</span>
                </>
              ) : (
                <>
                  <Volume2 size={24} aria-hidden="true" />
                  <span>Speak Text</span>
                </>
              )}
            </button>

            <div className="flex space-x-3">
              <button
                onClick={savePhrase}
                disabled={!text.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save phrase for later use"
              >
                <Save size={20} aria-hidden="true" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="grid md:grid-cols-3 gap-6">
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Adjust speech speed"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Adjust speech pitch"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Phrases */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Access Phrases</h2>
        
        {/* Greetings & Introductions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Greetings & Introductions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Hello!",
              "How are you today?",
              "Good morning!",
              "Good afternoon!",
              "Good evening!",
              "Nice to meet you."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Polite Expressions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Polite Expressions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Please.",
              "Thank you so much.",
              "You're welcome.",
              "Excuse me.",
              "I am sorry.",
              "That's okay."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Asking for Help */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Asking for Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Can you help me?",
              "Please repeat that.",
              "I didn't understand.",
              "Can you write it down?",
              "I need some assistance.",
              "Can you slow down?"
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 border border-yellow-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Needs */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Needs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "I am hungry.",
              "I am thirsty.",
              "Where is the restroom?",
              "I am tired.",
              "I need water.",
              "I need food."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Conversations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Daily Conversations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "What's your name?",
              "My name is John.",
              "Where are you from?",
              "I am from here.",
              "How old are you?",
              "I am a student."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200 border border-indigo-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Social Phrases */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Social Phrases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Let's go.",
              "I am busy right now.",
              "I am free now.",
              "Please wait a moment.",
              "I like this."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-200 border border-pink-200 text-sm"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Situations */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Emergency Situations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Call the doctor!",
              "I need medical help!",
              "Please call my family.",
              "I am in danger.",
              "Please call the police."
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  if (voice) utterance.voice = voice;
                  utterance.rate = rate;
                  utterance.pitch = pitch;
                  speechSynthesis.speak(utterance);
                }}
                className="p-2 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 text-sm font-medium"
                aria-label={`Speak: ${phrase}`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;