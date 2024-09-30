import OpenAI from 'openai';

let openai;

export const initializeOpenAI = (apiKey) => {
  openai = new OpenAI({ apiKey });
};

export const getOpenAIInstance = () => {
  if (!openai) {
    throw new Error('OpenAI não foi inicializado. Chame initializeOpenAI primeiro.');
  }
  return openai;
};

export const createOpenAIAssistant = async (name, description) => {
  const openai = getOpenAIInstance();
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: description,
      model: "gpt-3.5-turbo",
    });
    return assistant;
  } catch (error) {
    console.error('Erro ao criar assistente na OpenAI:', error);
    throw error;
  }
};