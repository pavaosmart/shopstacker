import { supabase } from '../integrations/supabase/supabase';
import { getOpenAIInstance } from './openai';

export const testBotCreation = async () => {
  try {
    // 1. Create a test bot in Supabase
    const { data: botData, error: botError } = await supabase
      .from('bots')
      .insert({
        name: 'Test Bot',
        description: 'A bot created for testing purposes',
      })
      .select()
      .single();

    if (botError) throw new Error(`Error creating bot: ${botError.message}`);

    console.log('Bot created:', botData);

    // 2. Add bot configuration
    const { error: configError } = await supabase
      .from('bot_configurations')
      .insert({
        bot_id: botData.id,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 150
      });

    if (configError) throw new Error(`Error creating bot configuration: ${configError.message}`);

    console.log('Bot configuration added');

    // 3. Add a test prompt
    const { error: promptError } = await supabase
      .from('bot_prompts')
      .insert({
        bot_id: botData.id,
        prompt_text: 'You are a helpful assistant.',
        prompt_order: 1
      });

    if (promptError) throw new Error(`Error creating bot prompt: ${promptError.message}`);

    console.log('Bot prompt added');

    // 4. Test OpenAI API
    const openai = getOpenAIInstance();
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." },
                 { role: "user", content: "Hello, how are you?" }],
      model: "gpt-3.5-turbo",
    });

    console.log('OpenAI API response:', completion.choices[0].message);

    return { success: true, message: 'Bot created and tested successfully' };
  } catch (error) {
    console.error('Error in testBotCreation:', error);
    return { success: false, message: error.message };
  }
};