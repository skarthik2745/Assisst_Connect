import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://modnpaposhfnzxdzffhr.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZG5wYXBvc2hmbnp4ZHpmZmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDk0MDEsImV4cCI6MjA3MzMyNTQwMX0.4pJITGISl1R0e5PxIqGuSc4DLTyVOLqcQ4d7YRZToIg'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase