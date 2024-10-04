-- Add is_imported column to user_products table if it doesn't exist
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS is_imported BOOLEAN DEFAULT false;

-- Update existing products to have is_imported set to true
UPDATE public.user_products
SET is_imported = true
WHERE is_imported IS NULL;

-- Update RLS policies
CREATE POLICY "Users can view their own imported products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id AND is_imported = true);

CREATE POLICY "Users can insert their own imported products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_imported = true);

CREATE POLICY "Users can update their own imported products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id AND is_imported = true);

CREATE POLICY "Users can delete their own imported products" 
ON public.user_products FOR DELETE 
USING (auth.uid() = user_id AND is_imported = true);