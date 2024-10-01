-- Update the products table to include new fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS markup NUMERIC DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update the RLS policies for the products table
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products FOR DELETE USING (auth.role() = 'authenticated');