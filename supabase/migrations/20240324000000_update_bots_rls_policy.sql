-- Remover políticas existentes na tabela bots
DROP POLICY IF EXISTS "Users can view their own bots" ON bots;
DROP POLICY IF EXISTS "Users can insert their own bots" ON bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON bots;

-- Criar novas políticas mais permissivas
CREATE POLICY "Enable read access for all authenticated users" ON bots
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON bots
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on user_id" ON bots
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON bots
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);