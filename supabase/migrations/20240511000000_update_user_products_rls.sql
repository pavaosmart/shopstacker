-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.user_products;

-- Create new policies
CREATE POLICY "Users can view their own products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.user_products FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure the user_id column exists
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON public.user_products(user_id);

-- Enable RLS on the table
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;