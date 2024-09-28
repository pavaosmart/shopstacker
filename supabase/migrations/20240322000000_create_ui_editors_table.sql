-- Create a new table for UI editors
CREATE TABLE ui_editors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE ui_editors ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to authenticated users
CREATE POLICY "Allow read access for authenticated users" ON ui_editors
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows insert for anyone (for registration)
CREATE POLICY "Allow insert for anyone" ON ui_editors
  FOR INSERT
  WITH CHECK (true);