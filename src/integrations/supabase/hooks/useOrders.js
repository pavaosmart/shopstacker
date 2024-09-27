import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### orders

| name                 | type                     | format  | required |
|----------------------|--------------------------|---------|----------|
| id                   | integer                  | int8    | true     |
| customer_id          | integer                  | int8    | false    |
| product_id           | integer                  | int8    | false    |
| quantity             | integer                  | int4    | true     |
| total_price          | numeric                  | number  | true     |
| status               | text                     | string  | true     |
| order_date           | timestamp with time zone | string  | false    |
| delivery_date        | timestamp with time zone | string  | false    |
| marketplace_order_id | text                     | string  | false    |

Foreign Key Relationships:
- customer_id references users.id
- product_id references products.id
*/

export const useOrder = (id) => useQuery({
  queryKey: ['orders', id],
  queryFn: () => fromSupabase(supabase.from('orders').select('*').eq('id', id).single()),
});

export const useOrders = () => useQuery({
  queryKey: ['orders'],
  queryFn: () => fromSupabase(supabase.from('orders').select('*')),
});

export const useAddOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newOrder) => fromSupabase(supabase.from('orders').insert([newOrder])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('orders').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('orders').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};