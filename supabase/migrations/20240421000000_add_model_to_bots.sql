-- Add model column to bots table
ALTER TABLE bots ADD COLUMN IF NOT EXISTS model TEXT;

-- Update existing rows to set a default value
UPDATE bots SET model = 'gpt-3.5-turbo' WHERE model IS NULL;