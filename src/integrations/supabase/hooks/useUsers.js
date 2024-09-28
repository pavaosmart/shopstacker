import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from "sonner";

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error(`Failed to fetch users: ${error.message}`);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error in useUsers:', error);
      toast.error(`An error occurred: ${error.message}`);
      throw error;
    }
  },
});

export const useCurrentUser = () => useQuery({
  queryKey: ['currentUser'],
  queryFn: async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user data:", error);
        throw new Error(`Error fetching user data: ${error.message}`);
      }
      
      return data || { id: user.id, email: user.email, full_name: null };
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
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};