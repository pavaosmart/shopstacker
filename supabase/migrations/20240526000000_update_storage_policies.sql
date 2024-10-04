-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access on products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to products bucket" ON storage.objects;

-- Create new policies
CREATE POLICY "Allow public read access on products bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to upload to products bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update and delete their own objects"
ON storage.objects FOR ALL
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);