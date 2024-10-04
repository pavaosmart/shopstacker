-- Function to create the 'products' bucket if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_products_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the 'products' bucket already exists
  SELECT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE name = 'products'
  ) INTO bucket_exists;

  -- If the bucket doesn't exist, create it
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('products', 'products', true);
    
    -- Grant access to authenticated users
    GRANT ALL ON BUCKET products TO authenticated;
    
    -- Allow public read access
    CREATE POLICY "Allow public read access on products bucket" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'products');
      
    -- Allow authenticated users to insert objects
    CREATE POLICY "Allow authenticated users to upload to products bucket" ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to ensure the bucket exists
SELECT ensure_products_bucket();

-- Drop the function after execution
DROP FUNCTION ensure_products_bucket();