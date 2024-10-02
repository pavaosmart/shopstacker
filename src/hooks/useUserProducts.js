import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { userProductsMock } from '../mocks/userProductsMock';

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    // Retorna os dados mock em vez de fazer uma chamada ao Supabase
    return userProductsMock;
  },
});

export const useDeleteUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId) => {
      // Simula a deleção do produto (não faz nada no mock)
      console.log(`Produto ${productId} deletado (simulação)`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

// Adicione outras funções conforme necessário (ex: addUserProduct, updateUserProduct)