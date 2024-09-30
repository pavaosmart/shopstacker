import OpenAI from 'openai';

let openaiInstance = null;

export const initializeOpenAI = (apiKey) => {
  if (apiKey) {
    openaiInstance = new OpenAI({ apiKey });
    console.log('OpenAI inicializado com sucesso');
  } else {
    console.error('Chave da API OpenAI não fornecida');
  }
};

export const getOpenAIInstance = () => {
  if (!openaiInstance) {
    throw new Error('OpenAI não foi inicializado. Chame initializeOpenAI primeiro.');
  }
  return openaiInstance;
};

export const fetchSpecificAssistant = async (assistantId) => {
  try {
    const openai = getOpenAIInstance();
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    return assistant;
  } catch (error) {
    console.error('Erro ao buscar o assistente:', error);
    throw error;
  }
};