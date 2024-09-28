-- Update users table to use UUID
ALTER TABLE users
ALTER COLUMN id TYPE uuid USING (uuid_generate_v4());

-- Update activity_logs table to use UUID for user_id
ALTER TABLE activity_logs
ALTER COLUMN user_id TYPE uuid USING (uuid_generate_v4());

-- Update foreign key constraint
ALTER TABLE activity_logs
DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey,
ADD CONSTRAINT activity_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);

-- Update RLS policy for activity_logs
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$;

DROP POLICY IF EXISTS "Users can only access their own logs" ON activity_logs;
CREATE POLICY "Users can only access their own logs"
ON activity_logs
FOR ALL
USING (auth.uid() = user_id);