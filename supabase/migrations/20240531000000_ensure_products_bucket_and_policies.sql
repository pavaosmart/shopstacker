-- Function to ensure the 'products' bucket exists and has the correct policies
CREATE OR REPLACE FUNCTION ensure_products_bucket_and_policies()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the 'products' bucket already exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'products'
  ) INTO bucket_exists;

  -- If the bucket doesn't exist, create it
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
  END IF;

  -- Remove existing policies for the 'products' bucket
  DELETE FROM storage.policies WHERE bucket_id = 'products';

  -- Create policy to allow public read access
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow public read access on products bucket', 
          'bucket_id = ''products''');

  -- Create policy to allow authenticated users to upload
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow authenticated users to upload to products bucket', 
          'bucket_id = ''products'' AND auth.role() = ''authenticated''');

  -- Create policy to allow authenticated users to delete their own files
  INSERT INTO storage.policies (bucket_id, name, definition)
  VALUES ('products', 'Allow authenticated users to delete own files from products bucket', 
          'bucket_id = ''products'' AND auth.role() = ''authenticated'' AND (storage.foldername(name))[1] = auth.uid()::text');
END;
$$ LANGUAGE plpgsql;

-- Execute the function to ensure the bucket exists and has the correct policies
SELECT ensure_products_bucket_and_policies();