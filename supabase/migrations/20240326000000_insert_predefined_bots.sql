-- Insert predefined bots
INSERT INTO public.bots (name, description, model, temperature, user_id)
VALUES
  ('Agente Financeiro', 'Especialista em questões financeiras e contábeis', 'gpt-3.5-turbo', 0.7, (SELECT id FROM auth.users LIMIT 1)),
  ('Agente de Suporte', 'Fornece suporte técnico e atendimento ao cliente', 'gpt-3.5-turbo', 0.8, (SELECT id FROM auth.users LIMIT 1)),
  ('Agente de Vendas', 'Especialista em vendas e negociações', 'gpt-3.5-turbo', 0.9, (SELECT id FROM auth.users LIMIT 1)),
  ('Agente de Treinamento', 'Responsável pelo treinamento de novos funcionários', 'gpt-4', 0.7, (SELECT id FROM auth.users LIMIT 1)),
  ('Agente de RH', 'Gerencia questões relacionadas a recursos humanos', 'gpt-3.5-turbo', 0.6, (SELECT id FROM auth.users LIMIT 1));

-- Insert configurations for predefined bots
INSERT INTO public.bot_configurations (bot_id, model, temperature, max_tokens)
SELECT id, model, temperature, 150
FROM public.bots
WHERE name IN ('Agente Financeiro', 'Agente de Suporte', 'Agente de Vendas', 'Agente de Treinamento', 'Agente de RH');

-- Insert sample prompts for predefined bots
INSERT INTO public.bot_prompts (bot_id, prompt_text, prompt_order)
SELECT id, 'Você é um assistente especializado. Forneça respostas precisas e úteis.', 1
FROM public.bots
WHERE name IN ('Agente Financeiro', 'Agente de Suporte', 'Agente de Vendas', 'Agente de Treinamento', 'Agente de RH');