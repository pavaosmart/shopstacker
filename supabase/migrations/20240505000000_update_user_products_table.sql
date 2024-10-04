-- Add images column as an array of text
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add cover_image_index column
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0;

-- Migrate existing image data to the new images array
UPDATE public.user_products
SET images = ARRAY[image]
WHERE image IS NOT NULL;

-- Drop the old image column
ALTER TABLE public.user_products
DROP COLUMN IF EXISTS image;