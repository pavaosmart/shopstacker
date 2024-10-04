-- Add a unique constraint to the sku column in the user_products table
ALTER TABLE public.user_products
ADD CONSTRAINT user_products_sku_unique UNIQUE (sku);

-- Update the RLS policies to reflect the new constraint
DROP POLICY IF EXISTS "Users can insert their own products" ON public.user_products;
CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.user_products;
CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);