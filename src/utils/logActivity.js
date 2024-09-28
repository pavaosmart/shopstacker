import { supabase } from '../integrations/supabase/supabase';

export const logActivity = async (action, description) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No active session found');
      return null;
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{ user_id: user.id, action, description }])
      .select();
    
    if (error) {
      console.error('Error logging activity:', error);
      return null;
    }
    
    console.log('Activity logged successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};