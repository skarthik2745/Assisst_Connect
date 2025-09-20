-- Fix preset phrases table to support user-specific phrases

-- Add user_id column if it doesn't exist
ALTER TABLE preset_phrases 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_preset_phrases_user_id ON preset_phrases(user_id);
CREATE INDEX IF NOT EXISTS idx_preset_phrases_category ON preset_phrases(category);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own phrases and default phrases" ON preset_phrases;
DROP POLICY IF EXISTS "Users can insert their own phrases" ON preset_phrases;
DROP POLICY IF EXISTS "Users can update their own phrases" ON preset_phrases;
DROP POLICY IF EXISTS "Users can delete their own phrases" ON preset_phrases;

-- Create new RLS policies
CREATE POLICY "Users can view their own phrases and default phrases" ON preset_phrases
    FOR SELECT USING (
        is_default = true OR 
        user_id = auth.uid()
    );

CREATE POLICY "Users can insert their own phrases" ON preset_phrases
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND 
        is_default = false
    );

CREATE POLICY "Users can update their own phrases" ON preset_phrases
    FOR UPDATE USING (
        user_id = auth.uid() AND 
        is_default = false
    );

CREATE POLICY "Users can delete their own phrases" ON preset_phrases
    FOR DELETE USING (
        user_id = auth.uid() AND 
        is_default = false
    );

-- Update other tables to include user_id if not exists
ALTER TABLE speech_sessions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE translations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_speech_sessions_user_id ON speech_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);

-- Update RLS policies for speech_sessions
DROP POLICY IF EXISTS "Users can manage their own speech sessions" ON speech_sessions;
CREATE POLICY "Users can manage their own speech sessions" ON speech_sessions
    FOR ALL USING (user_id = auth.uid());

-- Update RLS policies for translations
DROP POLICY IF EXISTS "Users can manage their own translations" ON translations;
CREATE POLICY "Users can manage their own translations" ON translations
    FOR ALL USING (user_id = auth.uid());