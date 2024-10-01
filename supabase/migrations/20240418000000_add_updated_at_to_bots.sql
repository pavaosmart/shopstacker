-- Adiciona o campo updated_at à tabela bots
ALTER TABLE bots ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Cria uma função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_bots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria um trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON bots
FOR EACH ROW
EXECUTE FUNCTION update_bots_updated_at();