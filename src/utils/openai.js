import OpenAI from 'openai';

let openaiInstance = null;

export const initializeOpenAI = (apiKey) => {
  openaiInstance = new OpenAI({ apiKey });
};

export const getOpenAIInstance = () => {
  if (!openaiInstance) {
    throw new Error('OpenAI has not been initialized. Call initializeOpenAI first.');
  }
  return openaiInstance;
};