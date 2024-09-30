import { supabase } from '../integrations/supabase/supabase';

export const fetchBots = async () => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('id, name, description, user_id, openai_assistant_id');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar bots:', error);
    throw error;
  }
};