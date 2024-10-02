import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

export const useBots = () => {
  return useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useBot = (id) => {
  return useQuery({
    queryKey: ['bot', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};