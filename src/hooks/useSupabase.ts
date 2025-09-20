import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

// Hook for preset phrases
export const usePresetPhrases = () => {
  const [phrases, setPhrases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhrases = async () => {
    const { data, error } = await supabase
      .from('preset_phrases')
      .select('*')
      .eq('is_default', true)
    
    if (!error) setPhrases(data || [])
    setLoading(false)
  }

  const addPhrase = async (category: string, phrase: string) => {
    const { data, error } = await supabase
      .from('preset_phrases')
      .insert({ category, phrase, is_default: false })
      .select()
    
    if (!error && data) {
      setPhrases(prev => [...prev, ...data])
    }
    return { data, error }
  }

  useEffect(() => {
    fetchPhrases()
  }, [])

  return { phrases, loading, addPhrase, refetch: fetchPhrases }
}

// Hook for speech sessions
export const useSpeechSessions = () => {
  const saveSession = async (transcript: string, confidence: number, language = 'en') => {
    const { data, error } = await supabase
      .from('speech_sessions')
      .insert({ transcript, confidence_score: confidence, language })
      .select()
    
    return { data, error }
  }

  return { saveSession }
}

// Hook for translations
export const useTranslations = () => {
  const saveTranslation = async (
    originalText: string, 
    translatedText: string, 
    sourceLang: string, 
    targetLang: string
  ) => {
    const { data, error } = await supabase
      .from('translations')
      .insert({
        original_text: originalText,
        translated_text: translatedText,
        source_language: sourceLang,
        target_language: targetLang
      })
      .select()
    
    return { data, error }
  }

  return { saveTranslation }
}