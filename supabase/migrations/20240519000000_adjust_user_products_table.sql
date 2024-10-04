-- Ajusta os tipos de dados e adiciona restrições
ALTER TABLE public.user_products
ALTER COLUMN price TYPE NUMERIC(10, 2),
ALTER COLUMN stock_quantity TYPE INTEGER,
ALTER COLUMN suggested_price TYPE NUMERIC(10, 2),
ALTER COLUMN cost_price TYPE NUMERIC(10, 2),
ALTER COLUMN price SET NOT NULL,
ALTER COLUMN stock_quantity SET NOT NULL,
ALTER COLUMN suggested_price SET NOT NULL,
ALTER COLUMN cost_price SET NOT NULL,
ADD CONSTRAINT check_price_positive CHECK (price >= 0),
ADD CONSTRAINT check_stock_quantity_non_negative CHECK (stock_quantity >= 0),
ADD CONSTRAINT check_suggested_price_positive CHECK (suggested_price >= 0),
ADD CONSTRAINT check_cost_price_positive CHECK (cost_price >= 0);

-- Adiciona um índice para melhorar a performance de buscas por SKU
CREATE INDEX IF NOT EXISTS idx_user_products_sku ON public.user_products(sku);

-- Garante que o SKU seja único para cada usuário
ALTER TABLE public.user_products
ADD CONSTRAINT unique_sku_per_user UNIQUE (user_id, sku);