-- Função para aplicar políticas de armazenamento
CREATE OR REPLACE FUNCTION apply_storage_policies()
RETURNS void AS $$
BEGIN
  -- Permitir acesso público de leitura no bucket de produtos
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Permitir acesso público de leitura no bucket de produtos" ON storage.objects FOR SELECT USING (bucket_id = ''products'')';

  -- Permitir que usuários autenticados façam upload para o bucket de produtos
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Permitir upload de usuários autenticados no bucket de produtos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''products'' AND auth.role() = ''authenticated'')';

  -- Permitir que usuários atualizem e excluam seus próprios objetos
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Permitir que usuários gerenciem seus próprios objetos" ON storage.objects FOR ALL USING (bucket_id = ''products'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)';
END;
$$ LANGUAGE plpgsql;