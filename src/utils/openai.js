import OpenAI from "openai";
import { supabase } from '../integrations/supabase/supabase';

const getApiKey = async () => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('openai_api_key')
    .single();
  
  if (error) {
    console.error('Error fetching OpenAI API key:', error);
    return null;
  }
  
  return data?.openai_api_key;
};

let openaiInstance = null;

export const initializeOpenAI = async (apiKey) => {
  openaiInstance = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export const getOpenAIInstance = async () => {
  if (!openaiInstance) {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not found');
    }
    await initializeOpenAI(apiKey);
  }
  return openaiInstance;
};

export const testConnection = async () => {
  try {
    const openai = await getOpenAIInstance();
    const response = await openai.models.list();
    console.log('OpenAI connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('OpenAI connection failed:', error);
    return false;
  }
};

export const createAssistant = async (name, instructions) => {
  try {
    const openai = await getOpenAIInstance();
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model: 'gpt-3.5-turbo',
      tools: [{ type: "code_interpreter" }],
    });
    console.log('Assistant created successfully:', assistant);
    return assistant;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
};

export const saveBotToDatabase = async (botData) => {
  const { data: bot, error: botError } = await supabase
    .from('bots')
    .insert([{
      name: botData.name,
      description: botData.description,
      user_id: (await supabase.auth.getUser()).data.user.id,
      openai_assistant_id: botData.openai_assistant_id
    }])
    .select()
    .single();

  if (botError) {
    console.error('Error saving bot to database:', botError);
    throw botError;
  }

  const { model, temperature, max_tokens, document } = botData;
  let document_path = null;

  if (document) {
    const { data, error } = await supabase.storage
      .from('bot-documents')
      .upload(`${bot.id}/${document.name}`, document);

    if (error) {
      console.error('Error uploading document:', error);
      throw error;
    }

    document_path = data.path;
  }

  const { error: configError } = await supabase
    .from('bot_configurations')
    .insert([{ 
      bot_id: bot.id, 
      model, 
      temperature, 
      max_tokens,
      document_path
    }]);

  if (configError) {
    console.error('Error saving bot configuration:', configError);
    throw configError;
  }

  const { prompts } = botData;
  const promptsWithBotId = prompts.map((prompt, index) => ({
    bot_id: bot.id,
    prompt_text: prompt,
    prompt_order: index + 1
  }));

  const { error: promptsError } = await supabase
    .from('bot_prompts')
    .insert(promptsWithBotId);

  if (promptsError) {
    console.error('Error saving bot prompts:', promptsError);
    throw promptsError;
  }

  console.log('Bot saved to database:', bot);
  return bot;
};

export const verifyBotData = async (botId) => {
  const { data: bot, error: botError } = await supabase
    .from('bots')
    .select('*')
    .eq('id', botId)
    .single();

  if (botError) {
    console.error('Error verifying bot data:', botError);
    return false;
  }

  const { data: config, error: configError } = await supabase
    .from('bot_configurations')
    .select('*')
    .eq('bot_id', botId)
    .single();

  if (configError) {
    console.error('Error verifying bot configuration:', configError);
    return false;
  }

  const { data: prompts, error: promptsError } = await supabase
    .from('bot_prompts')
    .select('*')
    .eq('bot_id', botId);

  if (promptsError) {
    console.error('Error verifying bot prompts:', promptsError);
    return false;
  }

  console.log('Bot data verified:', { bot, config, prompts });
  return true;
};

export const listAssistants = async () => {
  try {
    const openai = await getOpenAIInstance();
    const assistants = await openai.beta.assistants.list();
    console.log('Assistants fetched successfully:', assistants.data);
    return assistants.data;
  } catch (error) {
    console.error('Error fetching assistants:', error);
    throw error;
  }
};