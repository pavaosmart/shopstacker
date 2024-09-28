import { supabase } from '../integrations/supabase/supabase';

export const getUserInfo = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    throw error;
  }
};