import { supabase } from '../integrations/supabase/supabase';

export const logActivity = async (userId, action, description) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ user_id: userId, action, description }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};