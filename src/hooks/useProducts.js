import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });
};