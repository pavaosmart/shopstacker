import OpenAI from 'openai';

let openaiInstance = null;

export const initializeOpenAI = (apiKey) => {
  openaiInstance = new OpenAI({ apiKey });
};

export const getOpenAIInstance = () => {
  if (!openaiInstance) {
    throw new Error('OpenAI não foi inicializado. Chame initializeOpenAI primeiro.');
  }
  return openaiInstance;
};