import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1';

const getApiKey = () => localStorage.getItem('openai_api_key') || 'your_default_api_key_here';

const api = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`,
    'OpenAI-Beta': 'assistants=v1'
  }
});

const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error Response:', error.response.data);
    throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    console.error('API No Response:', error.request);
    throw new Error('No response received from API');
  } else {
    console.error('API Request Error:', error.message);
    throw new Error(`Error setting up request: ${error.message}`);
  }
};

export const testConnection = async () => {
  try {
    const response = await api.get('/models');
    console.log('Conexão bem-sucedida:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createAssistant = async (name, instructions) => {
  try {
    const response = await api.post('/assistants', {
      name,
      instructions,
      model: 'gpt-3.5-turbo',
      tools: [{ type: "code_interpreter" }],
      description: `Assistente criado para ${name}`,
    });
    console.log('Assistente criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const listAssistants = async () => {
  try {
    const response = await api.get('/assistants');
    console.log('Assistentes listados com sucesso:', response.data);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const initializeOpenAI = (apiKey) => {
  localStorage.setItem('openai_api_key', apiKey);
  api.defaults.headers['Authorization'] = `Bearer ${apiKey}`;
};

export const getOpenAIInstance = () => {
  return api;
};