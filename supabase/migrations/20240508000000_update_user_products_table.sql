-- Adiciona a coluna 'sku' como identificador único
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Adiciona a coluna 'cost_price' para o preço de custo
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2);

-- Adiciona colunas para dados específicos de marketplaces
ALTER TABLE public.user_products
ADD COLUMN IF NOT EXISTS mercadolivre JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shopee JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS amazon JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shopify JSONB DEFAULT '{}';

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