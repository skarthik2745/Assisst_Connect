import supabase from './supabase'

// Test database connections and data storage
export const testDatabaseIntegration = async () => {
  console.log('🔍 Testing database integration...')
  
  try {
    // Test 1: Check connection
    const { data: connection, error: connError } = await supabase.from('users').select('count').limit(1)
    if (connError) throw new Error(`Connection failed: ${connError.message}`)
    console.log('✅ Database connection successful')

    // Test 2: Test preset phrases storage
    const { data: phrases, error: phrasesError } = await supabase
      .from('preset_phrases')
      .insert({ category: 'Test', phrase: 'Test phrase', is_default: false })
      .select()
    
    if (phrasesError) console.log('❌ Preset phrases storage failed:', phrasesError.message)
    else console.log('✅ Preset phrases storage working')

    // Test 3: Test speech sessions storage
    const { data: speech, error: speechError } = await supabase
      .from('speech_sessions')
      .insert({ transcript: 'Test transcript', confidence_score: 0.95, language: 'en' })
      .select()
    
    if (speechError) console.log('❌ Speech sessions storage failed:', speechError.message)
    else console.log('✅ Speech sessions storage working')

    // Test 4: Test translations storage
    const { data: translation, error: translationError } = await supabase
      .from('translations')
      .insert({ 
        original_text: 'Hello', 
        translated_text: 'Hola', 
        source_language: 'en', 
        target_language: 'es' 
      })
      .select()
    
    if (translationError) console.log('❌ Translations storage failed:', translationError.message)
    else console.log('✅ Translations storage working')

    // Test 5: Test emotion logs storage
    const { data: emotion, error: emotionError } = await supabase
      .from('emotion_logs')
      .insert({ 
        emotion: 'happy', 
        message: 'Test message',
        voice_settings: { rate: 1.0, pitch: 1.0, volume: 1.0 }
      })
      .select()
    
    if (emotionError) console.log('❌ Emotion logs storage failed:', emotionError.message)
    else console.log('✅ Emotion logs storage working')

    // Test 6: Test user preferences storage
    const { data: prefs, error: prefsError } = await supabase
      .from('user_preferences')
      .insert({ 
        voice_rate: 1.2, 
        voice_pitch: 1.1, 
        voice_volume: 0.8,
        preferred_language: 'en',
        theme: 'neo-glow'
      })
      .select()
    
    if (prefsError) console.log('❌ User preferences storage failed:', prefsError.message)
    else console.log('✅ User preferences storage working')

    console.log('🎉 Database integration test completed!')
    
  } catch (error) {
    console.error('💥 Database test failed:', error)
  }
}

// Test individual feature data retrieval
export const testDataRetrieval = async () => {
  console.log('📊 Testing data retrieval...')
  
  // Get default phrases
  const { data: defaultPhrases } = await supabase
    .from('preset_phrases')
    .select('*')
    .eq('is_default', true)
  
  console.log('📝 Default phrases count:', defaultPhrases?.length || 0)
  
  // Get recent speech sessions
  const { data: recentSessions } = await supabase
    .from('speech_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  console.log('🎤 Recent speech sessions:', recentSessions?.length || 0)
  
  // Get translation history
  const { data: translations } = await supabase
    .from('translations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  console.log('🌐 Recent translations:', translations?.length || 0)
}

export default { testDatabaseIntegration, testDataRetrieval }