ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS variations JSONB,
ADD COLUMN IF NOT EXISTS suggested_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS additional_images TEXT[];

-- Update RLS policies
CREATE POLICY "Users can view all products" ON public.user_products
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own products" ON public.user_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.user_products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.user_products
    FOR DELETE USING (auth.uid() = user_id);