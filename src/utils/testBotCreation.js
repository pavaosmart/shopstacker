import { supabase } from '../integrations/supabase/supabase';
import { getOpenAIInstance } from './openai';

export const testBotCreation = async () => {
  try {
    console.log('Iniciando teste de criação de bot...');

    // 1. Criar um bot de teste no Supabase
    const { data: botData, error: botError } = await supabase
      .from('bots')
      .insert({
        name: 'Bot de Teste',
        description: 'Um bot criado para fins de teste',
      })
      .select()
      .single();

    if (botError) throw new Error(`Erro ao criar bot: ${botError.message}`);

    console.log('Bot criado:', botData);

    // 2. Adicionar configuração do bot
    const { error: configError } = await supabase
      .from('bot_configurations')
      .insert({
        bot_id: botData.id,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 150
      });

    if (configError) throw new Error(`Erro ao criar configuração do bot: ${configError.message}`);

    console.log('Configuração do bot adicionada');

    // 3. Adicionar um prompt de teste
    const { error: promptError } = await supabase
      .from('bot_prompts')
      .insert({
        bot_id: botData.id,
        prompt_text: 'Você é um assistente prestativo.',
        prompt_order: 1
      });

    if (promptError) throw new Error(`Erro ao criar prompt do bot: ${promptError.message}`);

    console.log('Prompt do bot adicionado');

    // 4. Testar API da OpenAI
    const openai = getOpenAIInstance();
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "Você é um assistente prestativo." },
                 { role: "user", content: "Olá, como você está?" }],
      model: "gpt-3.5-turbo",
    });

    console.log('Resposta da API OpenAI:', completion.choices[0].message);

    return { success: true, message: 'Bot criado e testado com sucesso' };
  } catch (error) {
    console.error('Erro no testBotCreation:', error);
    return { success: false, message: error.message };
  }
};