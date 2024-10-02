import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from "sonner";

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('user_products')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data;
  },
});

export const useDeleteUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      const { error } = await supabase
        .from('user_products')
        .delete()
        .eq('id', productId);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast.success('Produto excluído com sucesso');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    },
  });
};