-- Update products table to use UUID if it's not already
ALTER TABLE products
ALTER COLUMN id TYPE uuid USING (uuid_generate_v4());

-- Update RLS policy for products
CREATE POLICY "Users can view all products" ON products
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own products" ON products
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON products
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);