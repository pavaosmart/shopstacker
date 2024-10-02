import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userProductsMock } from '../mocks/userProductsMock';
import { toast } from "sonner";

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return userProductsMock;
  },
});

export const useAddUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      // Simulando um delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedProducts = [...userProductsMock, { ...newProduct, id: Date.now().toString() }];
      userProductsMock.push({ ...newProduct, id: Date.now().toString() });
      return updatedProducts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast.success('Produto adicionado com sucesso');
    },
    onError: (error) => {
      toast.error(`Falha ao adicionar produto: ${error.message}`);
    },
  });
};