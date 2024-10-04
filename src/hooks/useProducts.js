import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const useProduct = (sku) => useQuery({
  queryKey: ['products', sku],
  queryFn: async () => {
    if (!sku) {
      return null; // Return null if sku is undefined
    }
    try {
      const { data, error } = await supabase
        .from('user_products')
        .select('*')
        .eq('sku', sku)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, which is fine, just return null
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  enabled: !!sku, // Only run the query if sku is truthy
});

export const useProducts = () => useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return fromSupabase(supabase
      .from('user_products')
      .select('sku, name, description, price, cost_price, stock_quantity, suggested_price, images, cover_image_index')
      .eq('user_id', user.id)
    );
  },
});

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: { user } } = await supabase.auth.getUser();
      return fromSupabase(supabase.from('user_products').insert([{ ...newProduct, user_id: user.id }]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sku) => fromSupabase(supabase.from('user_products').delete().eq('sku', sku)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, ...updateData }) => fromSupabase(supabase.from('user_products').update(updateData).eq('sku', sku)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};