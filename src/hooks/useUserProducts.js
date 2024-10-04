import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id);
    if (error) throw error;
    return data;
  },
});

export const useAddUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if the product already exists
      const { data: existingProduct } = await supabase
        .from('user_products')
        .select('id')
        .eq('user_id', user.id)
        .eq('sku', newProduct.sku)
        .single();

      if (existingProduct) {
        throw new Error('Um produto com este SKU já existe.');
      }

      const { data, error } = await supabase
        .from('user_products')
        .insert([{ ...newProduct, user_id: user.id }]);
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
        .insert([{ ...productData, user_id: user.id }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};