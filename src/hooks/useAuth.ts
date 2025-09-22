import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })
    
    // Create user profile in database
    if (data.user && !error) {
      await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          username,
          email,
          created_at: new Date().toISOString()
        })
    }
    
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: any) => {
    try {
      // Update auth user metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: updates.email,
        data: {
          username: updates.username,
          avatar_url: updates.avatar_url
        }
      })
      
      if (authError) return { data: null, error: authError }
      
      // Update or insert user profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user?.id,
          username: updates.username,
          email: updates.email,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (profileError) {
        console.error('Profile update error:', profileError)
        // Don't fail if profile table doesn't exist, auth update succeeded
      }
      
      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}