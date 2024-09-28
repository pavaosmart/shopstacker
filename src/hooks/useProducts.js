import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthenticatedClient } from '../integrations/supabase/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity, sku, category, marketplace, marketplace_product_id, marketplace_status');
      if (error) throw error;
      return data;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};