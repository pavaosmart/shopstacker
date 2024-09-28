import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Não autenticado');
      }
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity, sku, category, marketplace, marketplace_product_id, marketplace_status');
      if (error) throw error;
      return data;
    },
    retry: false,
  });
};