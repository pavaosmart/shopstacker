-- Verificar e criar tabelas se não existirem
CREATE TABLE IF NOT EXISTS public.bot_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
    model TEXT,
    temperature NUMERIC,
    max_tokens INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bot_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
    prompt_text TEXT,
    prompt_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.bot_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_prompts ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir inserções, atualizações e leituras
CREATE POLICY "Users can manage their own bot configurations" ON public.bot_configurations
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.bots WHERE id = bot_configurations.bot_id
        )
    );

CREATE POLICY "Users can manage their own bot prompts" ON public.bot_prompts
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.bots WHERE id = bot_prompts.bot_id
        )
    );

-- Atualizar a política da tabela bots para incluir todas as operações
DROP POLICY IF EXISTS "Users can view their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can insert their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON public.bots;

CREATE POLICY "Users can manage their own bots" ON public.bots
    FOR ALL USING (auth.uid() = user_id);