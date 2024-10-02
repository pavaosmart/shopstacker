-- Add model and max_tokens columns to bots table
ALTER TABLE bots ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS max_tokens INTEGER;

-- Update existing rows to set default values
UPDATE bots SET model = 'gpt-3.5-turbo' WHERE model IS NULL;
UPDATE bots SET max_tokens = 150 WHERE max_tokens IS NULL;