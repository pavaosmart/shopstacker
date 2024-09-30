-- Remove existing policies on the bots table
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON bots;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON bots;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON bots;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON bots;

-- Create new policies
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

-- Ensure RLS is enabled on the bots table
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;