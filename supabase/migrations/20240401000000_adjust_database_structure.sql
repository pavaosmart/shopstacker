-- Add last_login column to profiles table
ALTER TABLE profiles ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;

-- Create index on user_id column in bots table
CREATE INDEX idx_bots_user_id ON bots(user_id);

-- Create bot_usage table
CREATE TABLE bot_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on bot_id and user_id columns in bot_usage table
CREATE INDEX idx_bot_usage_bot_id ON bot_usage(bot_id);
CREATE INDEX idx_bot_usage_user_id ON bot_usage(user_id);

-- Enable Row Level Security on bot_usage table
ALTER TABLE bot_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own bot usage
CREATE POLICY "Users can view their own bot usage" ON bot_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own bot usage
CREATE POLICY "Users can insert their own bot usage" ON bot_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own bot usage
CREATE POLICY "Users can update their own bot usage" ON bot_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at column in bot_usage table
CREATE TRIGGER update_bot_usage_updated_at
BEFORE UPDATE ON bot_usage
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at column in bots table
CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON bots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at column in profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();