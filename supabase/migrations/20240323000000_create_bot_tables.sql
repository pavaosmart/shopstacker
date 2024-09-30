-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bots table
CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bot_configurations table
CREATE TABLE bot_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    temperature NUMERIC NOT NULL,
    max_tokens INTEGER NOT NULL,
    top_p NUMERIC,
    frequency_penalty NUMERIC,
    presence_penalty NUMERIC,
    stop TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bot_prompts table
CREATE TABLE bot_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES bots(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    prompt_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for bots table
CREATE POLICY "Users can view their own bots" ON bots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bots" ON bots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bots" ON bots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bots" ON bots
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for bot_configurations table
CREATE POLICY "Users can view their bots' configurations" ON bot_configurations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_configurations.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert configurations for their bots" ON bot_configurations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_configurations.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update configurations for their bots" ON bot_configurations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_configurations.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete configurations for their bots" ON bot_configurations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_configurations.bot_id
            AND bots.user_id = auth.uid()
        )
    );

-- Create policies for bot_prompts table
CREATE POLICY "Users can view their bots' prompts" ON bot_prompts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_prompts.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert prompts for their bots" ON bot_prompts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_prompts.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update prompts for their bots" ON bot_prompts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_prompts.bot_id
            AND bots.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete prompts for their bots" ON bot_prompts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM bots
            WHERE bots.id = bot_prompts.bot_id
            AND bots.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_bot_configurations_bot_id ON bot_configurations(bot_id);
CREATE INDEX idx_bot_prompts_bot_id ON bot_prompts(bot_id);

-- Create a function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update 'updated_at'
CREATE TRIGGER update_bots_modtime
    BEFORE UPDATE ON bots
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bot_configurations_modtime
    BEFORE UPDATE ON bot_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bot_prompts_modtime
    BEFORE UPDATE ON bot_prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();