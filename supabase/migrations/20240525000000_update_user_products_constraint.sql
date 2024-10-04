-- Drop the existing constraint if it exists
ALTER TABLE public.user_products
DROP CONSTRAINT IF EXISTS unique_sku_per_user;

-- Add the correct unique constraint
ALTER TABLE public.user_products
ADD CONSTRAINT unique_sku_per_user UNIQUE (user_id, sku);

-- Update the RLS policies to reflect the new constraint
DROP POLICY IF EXISTS "Users can insert their own products" ON public.user_products;
CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.user_products;
CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);