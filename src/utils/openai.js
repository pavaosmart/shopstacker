import OpenAI from "openai";
import { supabase } from '../integrations/supabase/supabase';

const getApiKey = async () => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('openai_api_key')
    .limit(1);
  
  if (error) {
    console.error('Error fetching OpenAI API key:', error);
    return null;
  }
  
  return data?.[0]?.openai_api_key;
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
    console.log('Creating assistant with name:', name, 'and instructions:', instructions);
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
    if (error.response) {
      console.error('OpenAI API response:', error.response.data);
    }
    throw error;
  }
};

export const listAssistants = async () => {
  try {
    const { data: bots, error } = await supabase
      .from('bots')
      .select(`
        *,
        bot_configurations (*)
      `);

    if (error) {
      console.error('Error fetching bots:', error);
      throw error;
    }

    console.log('Bots fetched successfully:', bots);
    return bots;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw error;
  }
};