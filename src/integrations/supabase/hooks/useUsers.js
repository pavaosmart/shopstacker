import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { toast } from "sonner";

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(`Failed to fetch users: ${error.message}`);
      throw error;
    }
  },
});

export const useCurrentUser = () => useQuery({
  queryKey: ['currentUser'],
  queryFn: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        console.error("Error fetching user data:", error);
        // If no user found in the database or other error, return basic info from auth
        return { id: user.id, email: user.email, full_name: null };
      }

      return data || { id: user.id, email: user.email, full_name: null };
    } catch (error) {
      console.error("Error in useCurrentUser:", error);
      toast.error(`Failed to fetch current user: ${error.message}`);
      return null;
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
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};