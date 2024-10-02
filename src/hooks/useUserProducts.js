import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: () => fromSupabase(supabase.from('user_products').select('*')),
});

export const useAddUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct) => fromSupabase(supabase.from('user_products').insert([newProduct])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};