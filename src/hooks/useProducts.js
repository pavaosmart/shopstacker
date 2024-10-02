import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, price, stock_quantity, markup');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, price, stock_quantity, markup')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};