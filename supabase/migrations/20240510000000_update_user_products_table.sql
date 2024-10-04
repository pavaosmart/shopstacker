-- Adiciona novas colunas à tabela user_products
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Adiciona um índice para melhorar a performance de buscas por SKU
CREATE INDEX IF NOT EXISTS idx_user_products_sku ON public.user_products(sku);

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