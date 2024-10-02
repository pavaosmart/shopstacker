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
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Erro ao buscar chave de API OpenAI:', error);
      return null;
    }
    
    const apiKey = data?.openai_api_key;
    if (!apiKey) {
      throw new Error('Chave de API OpenAI não encontrada');
    }
    await initializeOpenAI(apiKey);
  }
  return openaiInstance;
};

export const testConnection = async () => {
  try {
    const openai = await getOpenAIInstance();
    const response = await openai.models.list();
    console.log('Conexão OpenAI bem-sucedida:', response.data);
    return true;
  } catch (error) {
    console.error('Falha na conexão OpenAI:', error);
    return false;
  }
};

export const getZildaAssistant = async () => {
  const openai = await getOpenAIInstance();
  const assistants = await openai.beta.assistants.list();
  const zilda = assistants.data.find(assistant => assistant.name.toLowerCase().includes('zilda'));
  if (!zilda) {
    throw new Error("Assistente Zilda não encontrado");
  }
  return zilda;
};

export const createAssistant = async (name, instructions) => {
  const openai = await getOpenAIInstance();
  const assistant = await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    model: "gpt-3.5-turbo",
  });
  return assistant;
};

export const updateAssistant = async (assistantId, updates) => {
  const openai = await getOpenAIInstance();
  const updatedAssistant = await openai.beta.assistants.update(assistantId, updates);
  return updatedAssistant;
};

export const deleteAssistant = async (assistantId) => {
  const openai = await getOpenAIInstance();
  await openai.beta.assistants.del(assistantId);
};

export const listAssistants = async () => {
  const openai = await getOpenAIInstance();
  const assistants = await openai.beta.assistants.list();
  return assistants.data;
};

export const uploadFile = async (file, purpose) => {
  const openai = await getOpenAIInstance();
  const response = await openai.files.create({ file, purpose });
  return response.id;
};
