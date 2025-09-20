import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

// Hook for preset phrases
export const usePresetPhrases = () => {
  const [phrases, setPhrases] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhrases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found')
        setLoading(false)
        return
      }

      console.log('Fetching phrases for user:', user.id)

      // Fetch both default phrases and user-specific phrases
      const { data, error } = await supabase
        .from('preset_phrases')
        .select('*')
        .or(`is_default.eq.true,user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      
      console.log('Database response:', { data, error })
      
      if (!error && data) {
        setPhrases(data)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(p => p.category))]
        setCategories(uniqueCategories)
      } else {
        console.error('Error fetching phrases:', error)
        setPhrases([])
        setCategories([])
      }
    } catch (err) {
      console.error('Exception in fetchPhrases:', err)
      setPhrases([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const addPhrase = async (category: string, phrase: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('preset_phrases')
      .insert({ 
        category, 
        phrase, 
        is_default: false,
        user_id: user.id
      })
      .select()
    
    if (!error && data) {
      setPhrases(prev => [...prev, ...data])
    }
    return { data, error }
  }

  useEffect(() => {
    fetchPhrases()
  }, [])

  return { phrases, categories, loading, addPhrase, refetch: fetchPhrases }
}

// Hook for speech sessions
export const useSpeechSessions = () => {
  const saveSession = async (transcript: string, confidence: number, language = 'en') => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('speech_sessions')
      .insert({ 
        transcript, 
        confidence_score: confidence, 
        language,
        user_id: user.id
      })
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
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data, error } = await supabase
      .from('translations')
      .insert({
        original_text: originalText,
        translated_text: translatedText,
        source_language: sourceLang,
        target_language: targetLang,
        user_id: user.id
      })
      .select()
    
    return { data, error }
  }

  return { saveTranslation }
}