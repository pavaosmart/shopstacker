import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useCurrentUser = () => useQuery({
  queryKey: ['currentUser'],
  queryFn: async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');
    
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('id, email, full_name', { count: 'exact' })
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user data:", error);
        throw new Error(`Error fetching user data: ${error.message}`);
      }
      
      if (count === 0) {
        console.warn(`User ${user.id} not found in users table. Returning default data.`);
        return { id: user.id, email: user.email, full_name: null };
      }
      
      return data;
    } catch (error) {
      console.error("Error in useCurrentUser:", error);
      throw error;
    }
  },
});

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};