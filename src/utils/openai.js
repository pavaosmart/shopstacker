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

export const listAssistants = async () => {
  try {
    const openai = await getOpenAIInstance();
    const assistants = await openai.beta.assistants.list();
    return assistants.data;
  } catch (error) {
    console.error('Erro ao listar assistentes:', error);
    throw error;
  }
};

export const createAssistant = async (name, instructions, model = 'gpt-3.5-turbo', options = {}) => {
  try {
    const openai = await getOpenAIInstance();
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model,
      ...options
    });
    return assistant;
  } catch (error) {
    console.error('Erro ao criar assistente:', error);
    throw error;
  }
};

export const updateAssistant = async (assistantId, updates) => {
  try {
    const openai = await getOpenAIInstance();
    const { max_tokens, ...validUpdates } = updates; // Remove max_tokens from the updates
    const updatedAssistant = await openai.beta.assistants.update(
      assistantId,
      validUpdates
    );
    return updatedAssistant;
  } catch (error) {
    console.error('Erro ao atualizar assistente:', error);
    throw error;
  }
};

export const deleteAssistant = async (assistantId) => {
  try {
    const openai = await getOpenAIInstance();
    await openai.beta.assistants.del(assistantId);
    console.log('Assistente excluído com sucesso:', assistantId);
  } catch (error) {
    console.error('Erro ao excluir assistente:', error);
    throw error;
  }
};