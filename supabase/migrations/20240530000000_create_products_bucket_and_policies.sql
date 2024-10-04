-- Função para criar o bucket 'products' e aplicar políticas
CREATE OR REPLACE FUNCTION create_products_bucket_and_policies()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Verifica se o bucket 'products' já existe
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'products'
  ) INTO bucket_exists;

  -- Se o bucket não existir, cria-o
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
  END IF;

  -- Remove políticas existentes para o bucket 'products'
  DELETE FROM storage.policies WHERE bucket_id = 'products';

  -- Cria política para permitir acesso público de leitura
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'products',
    'Allow public read access on products bucket',
    'bucket_id = ''products'''
  );

  -- Cria política para permitir que usuários autenticados façam upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'products',
    'Allow authenticated users to upload to products bucket',
    'bucket_id = ''products'' AND auth.role() = ''authenticated'''
  );

  -- Cria política para permitir que usuários autenticados excluam seus próprios arquivos
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES (
    'products',
    'Allow authenticated users to delete own files from products bucket',
    'bucket_id = ''products'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text'
  );

  -- Garante que o bucket seja público
  UPDATE storage.buckets
  SET public = true
  WHERE name = 'products';
END;
$$ LANGUAGE plpgsql;

-- Executa a função para criar o bucket e aplicar as políticas
SELECT create_products_bucket_and_policies();

-- Remove a função após a execução
DROP FUNCTION create_products_bucket_and_policies();

-- Garante que a extensão necessária para UUID esteja habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recria a tabela user_products com todas as colunas necessárias
DROP TABLE IF EXISTS public.user_products;
CREATE TABLE public.user_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  cost_price NUMERIC(10, 2) NOT NULL CHECK (cost_price >= 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
  suggested_price NUMERIC(10, 2) CHECK (suggested_price >= 0),
  main_image_url TEXT,
  images TEXT[] DEFAULT '{}',
  cover_image_index INTEGER DEFAULT 0,
  is_imported BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilita RLS para a tabela user_products
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Cria políticas RLS para user_products
CREATE POLICY "Users can view their own products" 
ON public.user_products FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" 
ON public.user_products FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.user_products FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.user_products FOR DELETE 
USING (auth.uid() = user_id);

-- Cria função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER update_user_products_updated_at
BEFORE UPDATE ON public.user_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Cria índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON public.user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_sku ON public.user_products(sku);