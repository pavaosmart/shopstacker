-- Adiciona a coluna 'images' como um array de texto
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Adiciona a coluna 'cover_image_index'
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0;

-- Migra os dados existentes da coluna 'image' para o novo array 'images'
UPDATE public.user_products
SET images = ARRAY[image]
WHERE image IS NOT NULL;

-- Remove a coluna 'image' antiga
ALTER TABLE public.user_products
DROP COLUMN IF EXISTS image;

-- Atualiza as políticas de segurança para incluir as novas colunas
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