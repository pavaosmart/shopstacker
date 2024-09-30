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

export const getOpenAIInstance = async () => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
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
  const { data, error } = await supabase
    .from('bots')
    .insert([botData])
    .select();

  if (error) {
    console.error('Error saving bot to database:', error);
    throw error;
  }

  console.log('Bot saved to database:', data);
  return data[0];
};

export const verifyBotData = async (botId) => {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('id', botId)
    .single();

  if (error) {
    console.error('Error verifying bot data:', error);
    return false;
  }

  console.log('Bot data verified:', data);
  return !!data;
};