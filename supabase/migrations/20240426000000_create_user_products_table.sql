-- Create the user_products table
CREATE TABLE IF NOT EXISTS public.user_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_products_updated_at
BEFORE UPDATE ON public.user_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();