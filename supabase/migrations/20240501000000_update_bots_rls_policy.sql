-- Drop existing policies on the bots table
DROP POLICY IF EXISTS "Users can view their own bots" ON bots;
DROP POLICY IF EXISTS "Users can insert their own bots" ON bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON bots;

-- Create new policies
CREATE POLICY "Authenticated users can view all bots" ON bots
    FOR SELECT
    TO authenticated
    USING (true);

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

-- Ensure RLS is enabled on the bots table
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;