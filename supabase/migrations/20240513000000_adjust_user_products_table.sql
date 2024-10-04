-- Remover colunas não utilizadas
ALTER TABLE public.user_products
DROP COLUMN IF EXISTS markup,
DROP COLUMN IF EXISTS additional_images,
DROP COLUMN IF EXISTS variations,
DROP COLUMN IF EXISTS mercadolivre,
DROP COLUMN IF EXISTS shopee,
DROP COLUMN IF EXISTS amazon,
DROP COLUMN IF EXISTS shopify;

-- Adicionar ou modificar colunas necessárias
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS suggested_price NUMERIC(10, 2),
ALTER COLUMN price TYPE NUMERIC(10, 2),
ALTER COLUMN stock_quantity TYPE INTEGER,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_imported BOOLEAN DEFAULT false;

-- Atualizar as políticas de segurança
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

-- Criar índices para melhorar o desempenho
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON public.user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_sku ON public.user_products(sku);