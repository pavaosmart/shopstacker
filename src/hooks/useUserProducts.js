import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    let query = supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id);
    
    try {
      // Try to filter by is_imported
      const { data, error } = await query.eq('is_imported', true);
      if (error) throw error;
      return data;
    } catch (error) {
      // If the is_imported column doesn't exist, fetch all products
      console.warn('is_imported column might not exist yet:', error.message);
      const { data, error: fallbackError } = await query;
      if (fallbackError) throw fallbackError;
      return data;
    }
  },
});

export const useAddUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('user_products')
        .insert([{ ...newProduct, user_id: user.id, is_imported: true }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useUpdateUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('user_products')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useDeleteUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      const { error } = await supabase
        .from('user_products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useImportUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('user_products')
        .insert([{ ...productData, user_id: user.id, is_imported: true }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};