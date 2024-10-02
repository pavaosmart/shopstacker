import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from "sonner";

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }
  return data;
};

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    try {
      return await fromSupabase(supabase.from('user_products').select('*'));
    } catch (error) {
      toast.error(`Failed to fetch user products: ${error.message}`);
      return [];
    }
  },
});

export const useAddUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      try {
        return await fromSupabase(supabase.from('user_products').insert([newProduct]));
      } catch (error) {
        toast.error(`Failed to add product: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast.success('Product added successfully');
    },
  });
};