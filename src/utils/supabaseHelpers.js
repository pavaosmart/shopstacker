import { supabase } from '../integrations/supabase/supabase';

export const fetchBots = async () => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar bots:', error);
    throw error;
  }
};