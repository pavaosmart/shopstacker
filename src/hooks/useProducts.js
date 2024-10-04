import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const useProduct = (sku) => useQuery({
  queryKey: ['products', sku],
  queryFn: () => fromSupabase(supabase
    .from('user_products')
    .select('*')
    .eq('sku', sku)
    .single()
  ),
});

export const useProducts = () => useQuery({
  queryKey: ['products'],
  queryFn: () => fromSupabase(supabase
    .from('user_products')
    .select('sku, name, description, price, cost_price, stock_quantity, suggested_price, images, cover_image_index')
  ),
});

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct) => fromSupabase(supabase.from('user_products').insert([newProduct])),
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