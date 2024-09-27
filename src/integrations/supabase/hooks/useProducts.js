import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### products

| name                   | type                     | format  | required |
|------------------------|--------------------------|---------|----------|
| id                     | integer                  | int8    | true     |
| name                   | text                     | string  | true     |
| description            | text                     | string  | false    |
| price                  | numeric                  | number  | true     |
| stock_quantity         | integer                  | int4    | true     |
| sku                    | text                     | string  | false    |
| category               | text                     | string  | false    |
| created_at             | timestamp with time zone | string  | false    |
| last_updated           | timestamp with time zone | string  | false    |
| marketplace            | text                     | string  | false    |
| marketplace_product_id | text                     | string  | false    |
| marketplace_status     | text                     | string  | false    |

*/

export const useProduct = (id) => useQuery({
  queryKey: ['products', id],
  queryFn: () => fromSupabase(supabase.from('products').select('*').eq('id', id).single()),
});

export const useProducts = () => useQuery({
  queryKey: ['products'],
  queryFn: () => fromSupabase(supabase.from('products').select('*')),
});

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct) => fromSupabase(supabase.from('products').insert([newProduct])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('products').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('products').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};