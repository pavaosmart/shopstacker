-- Drop existing policies on the users table
DROP POLICY IF EXISTS "Users can view and edit their own data" ON users;

-- Create a new policy that allows users to view their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;