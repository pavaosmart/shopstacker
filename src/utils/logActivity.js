import { supabase } from '../integrations/supabase/supabase';

export const logActivity = async (action, description) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session found');
      return null; // Return null instead of throwing an error
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ user_id: session.user.id, action, description }])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null; // Return null instead of throwing an error
  }
};