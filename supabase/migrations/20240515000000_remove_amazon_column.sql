-- Remove the 'amazon' column from the user_products table
ALTER TABLE public.user_products DROP COLUMN IF EXISTS amazon;

-- Remove other marketplace-specific columns if they exist
ALTER TABLE public.user_products DROP COLUMN IF EXISTS mercadolivre;
ALTER TABLE public.user_products DROP COLUMN IF EXISTS shopee;
ALTER TABLE public.user_products DROP COLUMN IF EXISTS shopify;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own products" ON public.user_products;
CREATE POLICY "Users can view their own products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own products" ON public.user_products;
CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.user_products;
CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON public.user_products;
CREATE POLICY "Users can delete their own products" 
ON public.user_products FOR DELETE 
USING (auth.uid() = user_id);