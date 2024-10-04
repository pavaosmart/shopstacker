-- Drop existing tables and related objects
DROP TABLE IF EXISTS public.user_products CASCADE;
DROP TABLE IF EXISTS storage.objects CASCADE;
DROP TABLE IF EXISTS storage.buckets CASCADE;

-- Recreate the user_products table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on user_products
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_products
CREATE POLICY "Users can manage their own products" ON public.user_products
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Create policy to allow public read access to product images
CREATE POLICY "Allow public read access to product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');