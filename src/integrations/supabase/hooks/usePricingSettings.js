import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### pricing_settings

| name                   | type    | format  | required |
|------------------------|---------|---------|----------|
| id                     | integer | int8    | true     |
| product_id             | integer | int8    | false    |
| product_name           | text    | string  | true     |
| ean                    | text    | string  | false    |
| sku                    | text    | string  | false    |
| min_profit_margin      | numeric | number  | false    |
| sale_price             | numeric | number  | true     |
| markup                 | numeric | number  | false    |
| product_cost           | numeric | number  | false    |
| additional_inputs      | numeric | number  | false    |
| tax                    | numeric | number  | false    |
| marketplace_commission | numeric | number  | false    |
| fixed_fee              | numeric | number  | false    |
| shipping_cost          | numeric | number  | false    |
| discount_active        | boolean | boolean | false    |
| discount_value         | numeric | number  | false    |
| total_deduction        | numeric | number  | false    |
| marketplace_url        | text    | string  | false    |
| product_image_url      | text    | string  | false    |
| days_since_created     | integer | int4    | false    |
| quantity_sold          | integer | int4    | false    |
| revenue_generated      | numeric | number  | false    |
| is_full                | boolean | boolean | false    |
| is_free_shipping       | boolean | boolean | false    |
| listing_type           | text    | string  | false    |

Foreign Key Relationships:
- product_id references products.id
*/

export const usePricingSetting = (id) => useQuery({
  queryKey: ['pricing_settings', id],
  queryFn: () => fromSupabase(supabase.from('pricing_settings').select('*').eq('id', id).single()),
});

export const usePricingSettings = () => useQuery({
  queryKey: ['pricing_settings'],
  queryFn: () => fromSupabase(supabase.from('pricing_settings').select('*')),
});

export const useAddPricingSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPricingSetting) => fromSupabase(supabase.from('pricing_settings').insert([newPricingSetting])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_settings'] });
    },
  });
};

export const useUpdatePricingSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('pricing_settings').update(updateData).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_settings'] });
    },
  });
};

export const useDeletePricingSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('pricing_settings').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_settings'] });
    },
  });
};