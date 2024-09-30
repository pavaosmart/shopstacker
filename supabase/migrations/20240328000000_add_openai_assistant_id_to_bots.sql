-- Add openai_assistant_id column to bots table
ALTER TABLE bots ADD COLUMN openai_assistant_id TEXT;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Users can view their own bots" ON bots;
DROP POLICY IF EXISTS "Users can insert their own bots" ON bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON bots;

CREATE POLICY "Users can view their own bots" ON bots
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bots" ON bots
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bots" ON bots
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bots" ON bots
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);