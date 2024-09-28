import { supabase } from '../integrations/supabase/supabase';

export const logActivity = async (action, description) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ user_id: user.id, action, description }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};