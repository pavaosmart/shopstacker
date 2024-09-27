import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### competitor_prices

| name                    | type                     | format  | required |
|-------------------------|--------------------------|---------|----------|
| id                      | integer                  | int8    | true     |
| product_id              | integer                  | int8    | false    |
| competitor_product_name | text                     | string  | true     |
| competitor_product_id   | text                     | string  | false    |
| competitor_price        | numeric                  | number  | true     |
| last_price_update       | timestamp with time zone | string  | false    |
| competitor_url          | text                     | string  | false    |
| marketplace             | text                     | string  | false    |

Foreign Key Relationships:
- product_id references products.id
*/

export const useCompetitorPrice = (id) => useQuery({
  queryKey: ['competitor_prices', id],
  queryFn: () => fromSupabase(supabase.from('competitor_prices').select('*').eq('id', id).single()),
});

export const useCompetitorPrices = () => useQuery({
  queryKey: ['competitor_prices'],
  queryFn: () => fromSupabase(supabase.from('competitor_prices').select('*')),
});

export const useAddCompetitorPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCompetitorPrice) => fromSupabase(supabase.from('competitor_prices').insert([newCompetitorPrice])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor_prices'] });
    },
  });
};

export const useUpdateCompetitorPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('competitor_prices').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor_prices'] });
    },
  });
};

export const useDeleteCompetitorPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('competitor_prices').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitor_prices'] });
    },
  });
};