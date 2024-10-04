-- Function to apply storage policies
CREATE OR REPLACE FUNCTION apply_storage_policies()
RETURNS void AS $$
BEGIN
  -- Allow public read access on products bucket
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow public read access on products bucket" ON storage.objects FOR SELECT USING (bucket_id = ''products'')';

  -- Allow authenticated users to upload to products bucket
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload to products bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''products'' AND auth.role() = ''authenticated'')';

  -- Allow users to update and delete their own objects
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow users to update and delete their own objects" ON storage.objects FOR ALL USING (bucket_id = ''products'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text)';
END;
$$ LANGUAGE plpgsql;