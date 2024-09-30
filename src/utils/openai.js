import OpenAI from 'openai';
import { supabase } from '../integrations/supabase/supabase';

let openai;

export const initializeOpenAI = (apiKey) => {
  openai = new OpenAI({ apiKey });
};

export const testConnection = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, are you there?" }],
    });
    return response.choices[0].message.content.trim() !== '';
  } catch (error) {
    console.error('Error testing OpenAI connection:', error);
    return false;
  }
};

export const listAssistants = async () => {
  try {
    const response = await openai.beta.assistants.list({
      order: "desc",
      limit: 20,
    });
    return response.data;
  } catch (error) {
    console.error('Error listing assistants:', error);
    throw error;
  }
};

export const createAssistant = async (name, prompt, model, temperature, maxTokens) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: name,
      instructions: prompt,
      model: model,
      tools: [{ type: "code_interpreter" }],
    });

    // Save assistant details to Supabase
    const { data, error } = await supabase
      .from('bots')
      .insert({
        name: name,
        openai_assistant_id: assistant.id,
        model: model,
        temperature: temperature,
        max_tokens: maxTokens,
        prompt: prompt,
      });

    if (error) throw error;

    return assistant;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
};

export const updateAssistant = async (assistantId, name, prompt, model, temperature, maxTokens) => {
  try {
    const assistant = await openai.beta.assistants.update(assistantId, {
      name: name,
      instructions: prompt,
      model: model,
    });

    // Update assistant details in Supabase
    const { data, error } = await supabase
      .from('bots')
      .update({
        name: name,
        model: model,
        temperature: temperature,
        max_tokens: maxTokens,
        prompt: prompt,
      })
      .eq('openai_assistant_id', assistantId);

    if (error) throw error;

    return assistant;
  } catch (error) {
    console.error('Error updating assistant:', error);
    throw error;
  }
};

export const saveBotToDatabase = async (botData) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .insert(botData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving bot to database:', error);
    throw error;
  }
};

export const verifyBotData = async (botId) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('id', botId)
      .single();

    if (error) throw error;
    return data !== null;
  } catch (error) {
    console.error('Error verifying bot data:', error);
    return false;
  }
};