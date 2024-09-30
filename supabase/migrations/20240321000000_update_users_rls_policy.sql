-- Drop existing policies on the users table
DROP POLICY IF EXISTS "Authenticated users can view all users' data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create a new policy that allows authenticated users to view all users' data
CREATE POLICY "Authenticated users can view all users' data" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;