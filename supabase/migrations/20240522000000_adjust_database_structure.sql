-- Função para criar o bucket 'products' se não existir
CREATE OR REPLACE FUNCTION ensure_products_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'products'
  ) INTO bucket_exists;

  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
    
    -- Permitir acesso de leitura pública
    CREATE POLICY "Allow public read access on products bucket" ON storage.objects
      FOR SELECT USING (bucket_id = 'products');
      
    -- Permitir que usuários autenticados insiram objetos
    CREATE POLICY "Allow authenticated users to upload to products bucket" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para garantir que o bucket exista
SELECT ensure_products_bucket();

-- Remover a função após a execução
DROP FUNCTION ensure_products_bucket();

-- Ajustar a tabela user_products
DROP TABLE IF EXISTS public.user_products;
CREATE TABLE public.user_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  cost_price NUMERIC(10, 2) NOT NULL CHECK (cost_price >= 0),
  suggested_price NUMERIC(10, 2) NOT NULL CHECK (suggested_price >= 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
  category TEXT,
  tags TEXT[],
  images TEXT[] DEFAULT '{}',
  cover_image_index INTEGER DEFAULT 0,
  is_imported BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_sku_per_user UNIQUE (user_id, sku)
);

-- Criar índice para melhorar a performance de buscas por SKU
CREATE INDEX IF NOT EXISTS idx_user_products_sku ON public.user_products(sku);
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON public.user_products(user_id);

-- Habilitar RLS para a tabela user_products
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para user_products
CREATE POLICY "Users can view their own non-hidden products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id AND NOT is_hidden);

CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.user_products FOR DELETE 
USING (auth.uid() = user_id);

-- Criar função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER update_user_products_updated_at
BEFORE UPDATE ON public.user_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Remover tabelas e funções obsoletas (se existirem)
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.pricing_settings CASCADE;
DROP TABLE IF EXISTS public.competitor_prices CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;