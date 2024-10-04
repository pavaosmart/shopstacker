-- Função para garantir que o bucket 'products' exista e tenha as políticas corretas
CREATE OR REPLACE FUNCTION ensure_products_bucket_and_policies()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Verificar se o bucket 'products' já existe
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'products'
  ) INTO bucket_exists;

  -- Se o bucket não existir, criá-lo
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
  END IF;

  -- Remover políticas existentes para o bucket 'products'
  DELETE FROM storage.policies WHERE bucket_id = 'products';

  -- Criar política para permitir leitura pública
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow public read access', '{"allow_anonymous": true, "allow_public": true, "operations": ["SELECT"]}');

  -- Criar política para permitir que usuários autenticados façam upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow authenticated users to upload', '{"role": "authenticated", "operations": ["INSERT", "UPDATE"]}');

  -- Criar política para permitir que usuários autenticados excluam seus próprios arquivos
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow authenticated users to delete own files', '{"role": "authenticated", "operations": ["DELETE"], "condition": "owner = auth.uid()"}');
END;
$$ LANGUAGE plpgsql;

-- Executar a função para garantir que o bucket exista e tenha as políticas corretas
SELECT ensure_products_bucket_and_policies();

-- Remover a função após a execução
DROP FUNCTION ensure_products_bucket_and_policies();