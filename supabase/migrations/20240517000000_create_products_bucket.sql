-- Function to create the 'products' bucket if it doesn't exist
CREATE OR REPLACE FUNCTION create_products_bucket()
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
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the bucket
SELECT create_products_bucket();

-- Drop the function after execution
DROP FUNCTION create_products_bucket();