import OpenAI from "openai";
import { supabase } from '../integrations/supabase/supabase';

let openaiInstance = null;

export const initializeOpenAI = async (apiKey) => {
  openaiInstance = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export const getOpenAIInstance = async () => {
  if (!openaiInstance) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('openai_api_key')
      .limit(1);
    
    if (error) {
      console.error('Error fetching OpenAI API key:', error);
      return null;
    }
    
    const apiKey = data?.[0]?.openai_api_key;
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

export const listAssistants = async () => {
  try {
    const openai = await getOpenAIInstance();
    const assistants = await openai.beta.assistants.list();
    const filteredAssistants = assistants.data.filter(assistant => 
      assistant.name === 'Zilda 2' || assistant.name === 'Marcio'
    );
    console.log('Filtered assistants:', filteredAssistants);
    return filteredAssistants;
  } catch (error) {
    console.error('Error listing assistants:', error);
    throw error;
  }
};

export const createAssistant = async (name, instructions, model = 'gpt-3.5-turbo') => {
  try {
    const openai = await getOpenAIInstance();
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model,
    });
    return assistant;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
};