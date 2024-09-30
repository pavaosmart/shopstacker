-- Adicionar coluna para armazenar o caminho do documento na tabela bot_configurations
ALTER TABLE public.bot_configurations
ADD COLUMN document_path TEXT;

-- Atualizar a coluna model para aceitar os novos valores de modelo GPT
ALTER TABLE public.bot_configurations
ALTER COLUMN model TYPE TEXT;

-- Atualizar as políticas RLS para incluir o novo campo
DROP POLICY IF EXISTS "Users can manage their own bot configurations" ON public.bot_configurations;
CREATE POLICY "Users can manage their own bot configurations" ON public.bot_configurations
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.bots WHERE id = bot_configurations.bot_id
        )
    );