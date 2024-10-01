-- Add max_tokens column to bots table
ALTER TABLE bots ADD COLUMN max_tokens INTEGER;

-- Update existing rows to set a default value
UPDATE bots SET max_tokens = 150 WHERE max_tokens IS NULL;