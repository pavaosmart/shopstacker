-- Add is_hidden column to user_products table
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Update RLS policies
CREATE POLICY "Users can view their own non-hidden products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id AND NOT is_hidden);

CREATE POLICY "Users can update is_hidden for their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);