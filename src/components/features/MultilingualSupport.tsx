import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Globe, Mic, Volume2, Copy, RefreshCw, Settings } from 'lucide-react';

interface MultilingualSupportProps {
  onClose: () => void;
}

interface Translation {
  id: number;
  originalText: string;
  originalLang: string;
  translatedText: string;
  targetLang: string;
  timestamp: string;
}

const MultilingualSupport: React.FC<MultilingualSupportProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'auto', name: 'Auto-detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
    { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
    { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
    { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
    { code: 'et', name: 'Estonian', flag: '🇪🇪' },
    { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
    { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'fa', name: 'Persian', flag: '🇮🇷' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
    { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'my', name: 'Myanmar', flag: '🇲🇲' },
    { code: 'km', name: 'Khmer', flag: '🇰🇭' },
    { code: 'lo', name: 'Lao', flag: '🇱🇦' },
    { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'is', name: 'Icelandic', flag: '🇮🇸' },
    { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
    { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { code: 'ga', name: 'Irish', flag: '🇮🇪' },
    { code: 'eu', name: 'Basque', flag: '🇪🇸' },
    { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
    { code: 'gl', name: 'Galician', flag: '🇪🇸' },
    { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺' },
    { code: 'mk', name: 'Macedonian', flag: '🇲🇰' },
    { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
    { code: 'be', name: 'Belarusian', flag: '🇧🇾' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
    { code: 'kk', name: 'Kazakh', flag: '🇰🇿' },
    { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬' },
    { code: 'tg', name: 'Tajik', flag: '🇹🇯' },
    { code: 'mn', name: 'Mongolian', flag: '🇲🇳' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'haw', name: 'Hawaiian', flag: '🇺🇸' },
    { code: 'mi', name: 'Maori', flag: '🇳🇿' },
    { code: 'sm', name: 'Samoan', flag: '🇼🇸' },
    { code: 'to', name: 'Tongan', flag: '🇹🇴' },
    { code: 'fj', name: 'Fijian', flag: '🇫🇯' }
  ];

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on source language selection
      if (sourceLang !== 'auto') {
        recognitionRef.current.lang = sourceLang;
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        
        // Auto-translate after speech input
        if (transcript.trim()) {
          translateText(transcript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [sourceLang]);

  // Auto-detect language function
  const detectLanguage = (text: string): string => {
    // Simple language detection based on character patterns
    const patterns = {
      'ar': /[\u0600-\u06FF]/,
      'zh': /[\u4e00-\u9fff]/,
      'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
      'ko': /[\uac00-\ud7af]/,
      'ru': /[\u0400-\u04FF]/,
      'hi': /[\u0900-\u097F]/,
      'th': /[\u0e00-\u0e7f]/,
      'he': /[\u0590-\u05FF]/,
      'el': /[\u0370-\u03FF]/
    };
    
    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) return lang;
    }
    
    // Default to English if no pattern matches
    return 'en';
  };

  const translateText = async (text: string = inputText) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    
    try {
      // Auto-detect source language if set to auto
      const detectedLang = sourceLang === 'auto' ? detectLanguage(text) : sourceLang;
      
      // Use Google Translate API (mock implementation)
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detectedLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      
      let translatedText = '';
      
      if (response.ok) {
        const data = await response.json();
        translatedText = data[0]?.[0]?.[0] || text;
      } else {
        // Fallback to mock translation
        const mockTranslations: { [key: string]: { [key: string]: string } } = {
          'Hello': { es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao', pt: 'Olá', ru: 'Привет', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ar: 'مرحبا', hi: 'नमस्ते' },
          'Thank you': { es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie', pt: 'Obrigado', ru: 'Спасибо', ja: 'ありがとう', ko: '감사합니다', zh: '谢谢', ar: 'شكرا', hi: 'धन्यवाद' },
          'Please': { es: 'Por favor', fr: 'S\'il vous plaît', de: 'Bitte', it: 'Per favore', pt: 'Por favor', ru: 'Пожалуйста', ja: 'お願いします', ko: '제발', zh: '请', ar: 'من فضلك', hi: 'कृपया' },
          'Yes': { es: 'Sí', fr: 'Oui', de: 'Ja', it: 'Sì', pt: 'Sim', ru: 'Да', ja: 'はい', ko: '네', zh: '是的', ar: 'نعم', hi: 'हाँ' },
          'No': { es: 'No', fr: 'Non', de: 'Nein', it: 'No', pt: 'Não', ru: 'Нет', ja: 'いいえ', ko: '아니요', zh: '不', ar: 'لا', hi: 'नहीं' },
          'Help': { es: 'Ayuda', fr: 'Aide', de: 'Hilfe', it: 'Aiuto', pt: 'Ajuda', ru: 'Помощь', ja: '助けて', ko: '도움', zh: '帮助', ar: 'مساعدة', hi: 'मदद' },
          'Sorry': { es: 'Lo siento', fr: 'Désolé', de: 'Entschuldigung', it: 'Scusa', pt: 'Desculpa', ru: 'Извините', ja: 'ごめんなさい', ko: '죄송합니다', zh: '对不起', ar: 'آسف', hi: 'माफ़ करना' },
          'Good morning': { es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen', it: 'Buongiorno', pt: 'Bom dia', ru: 'Доброе утро', ja: 'おはようございます', ko: '좋은 아침', zh: '早上好', ar: 'صباح الخير', hi: 'सुप्रभात' },
          'Good night': { es: 'Buenas noches', fr: 'Bonne nuit', de: 'Gute Nacht', it: 'Buonanotte', pt: 'Boa noite', ru: 'Спокойной ночи', ja: 'おやすみなさい', ko: '잘 자요', zh: '晚安', ar: 'تصبح على خير', hi: 'शुभ रात्रि' },
          'How are you?': { es: '¿Cómo estás?', fr: 'Comment allez-vous?', de: 'Wie geht es dir?', it: 'Come stai?', pt: 'Como você está?', ru: 'Как дела?', ja: '元気ですか？', ko: '어떻게 지내세요?', zh: '你好吗？', ar: 'كيف حالك؟', hi: 'आप कैसे हैं?' }
        };
        
        // Find closest match or use fallback
        const lowerText = text.toLowerCase();
        const matchedKey = Object.keys(mockTranslations).find(key => 
          lowerText.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerText)
        );
        
        translatedText = matchedKey ? 
          mockTranslations[matchedKey][targetLang] || `[${languages.find(l => l.code === targetLang)?.name}]: ${text}` :
          `[${languages.find(l => l.code === targetLang)?.name}]: ${text}`;
      }
      
      const translation: Translation = {
        id: Date.now(),
        originalText: text,
        originalLang: detectedLang,
        translatedText,
        targetLang,
        timestamp: new Date().toLocaleTimeString()
      };

      setTranslations(prev => [translation, ...prev]);
      setCurrentTranslation(translatedText);
      
    } catch (error) {
      console.error('Translation error:', error);
      setCurrentTranslation(`Translation failed. Please try again.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakTranslation = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(lang)) || voices[0];
      if (voice) utterance.voice = voice;
      
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const copyTranslation = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const swapLanguages = () => {
    if (sourceLang !== 'auto') {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      
      // Swap text if there's a current translation
      if (currentTranslation) {
        setInputText(currentTranslation);
        setCurrentTranslation('');
      }
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
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Globe size={24} className="text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multilingual Support</h1>
            <p className="text-gray-600">Real-time translation and multilingual communication</p>
          </div>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        {/* Language Selection */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="source-lang" className="block text-sm font-medium text-blue-100 mb-1">
                  From
                </label>
                <select
                  id="source-lang"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-white/50"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-gray-900">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={swapLanguages}
                disabled={sourceLang === 'auto'}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Swap languages"
              >
                <RefreshCw size={20} aria-hidden="true" />
              </button>
              
              <div>
                <label htmlFor="target-lang" className="block text-sm font-medium text-blue-100 mb-1">
                  To
                </label>
                <select
                  id="target-lang"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-white/50"
                >
                  {languages.filter(l => l.code !== 'auto').map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-gray-900">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Output Areas */}
        <div className="grid md:grid-cols-2 gap-0 divide-x divide-gray-200">
          {/* Input Area */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Original Text</h3>
              <button
                onClick={startListening}
                disabled={isListening}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isListening
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                aria-label={isListening ? 'Listening...' : 'Start voice input'}
              >
                <Mic size={16} aria-hidden="true" />
                <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak your text here..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Text to translate"
            />
            
            <button
              onClick={() => translateText()}
              disabled={!inputText.trim() || isTranslating}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {/* Output Area */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Translation</h3>
              {currentTranslation && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => speakTranslation(currentTranslation, targetLang)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                    aria-label="Speak translation"
                  >
                    <Volume2 size={16} aria-hidden="true" />
                    <span>Speak</span>
                  </button>
                  
                  <button
                    onClick={() => copyTranslation(currentTranslation)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    aria-label="Copy translation"
                  >
                    <Copy size={16} aria-hidden="true" />
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-full h-40 p-4 bg-white border border-gray-300 rounded-lg">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                </div>
              ) : currentTranslation ? (
                <p className="text-gray-900 text-lg leading-relaxed">{currentTranslation}</p>
              ) : (
                <p className="text-gray-500 italic">Translation will appear here...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Translation History */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Translation History</h2>
          <p className="text-gray-600">{translations.length} translations</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {translations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Globe size={48} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p>No translations yet</p>
              <p className="text-sm">Start translating to see your history here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {translations.map((translation) => (
                <div key={translation.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{translation.timestamp}</span>
                        <span>•</span>
                        <span>
                          {languages.find(l => l.code === translation.originalLang)?.flag} 
                          {languages.find(l => l.code === translation.originalLang)?.name}
                        </span>
                        <span>→</span>
                        <span>
                          {languages.find(l => l.code === translation.targetLang)?.flag}
                          {languages.find(l => l.code === translation.targetLang)?.name}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Original</p>
                          <p className="text-gray-900">{translation.originalText}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Translation</p>
                          <p className="text-gray-900 font-medium">{translation.translatedText}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => speakTranslation(translation.translatedText, translation.targetLang)}
                        className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors duration-200"
                        aria-label={`Speak translation: ${translation.translatedText}`}
                      >
                        <Volume2 size={14} className="text-green-600" aria-hidden="true" />
                      </button>
                      
                      <button
                        onClick={() => copyTranslation(translation.translatedText)}
                        className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-200"
                        aria-label={`Copy translation: ${translation.translatedText}`}
                      >
                        <Copy size={14} className="text-blue-600" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Multilingual Features</h3>
        <ul className="space-y-2 text-blue-800" role="list">
          <li>• Real-time translation between 70+ languages</li>
          <li>• Automatic language detection for source text</li>
          <li>• Voice input with speech recognition</li>
          <li>• Text-to-speech in multiple languages and accents</li>
          <li>• Translation history for easy reference</li>
          <li>• Swap languages quickly with one click</li>
          <li>• Copy translations to share with others</li>
          <li>• Support for major world languages including Asian, European, African, and Middle Eastern languages</li>
        </ul>
      </div>
    </div>
  );
};

export default MultilingualSupport;