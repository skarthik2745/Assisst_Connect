import supabase from './supabase'

export const debugAuth = async () => {
  try {
    // Check current user
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current auth user:', user)
    
    // Check users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    console.log('Users table data:', users)
    console.log('Users table error:', error)
    
    // Test insert (if user exists)
    if (user) {
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.username || 'Test User',
          user_type: 'both'
        })
        .select()
      
      console.log('Insert test data:', insertData)
      console.log('Insert test error:', insertError)
    }
    
  } catch (err) {
    console.error('Debug error:', err)
  }
}