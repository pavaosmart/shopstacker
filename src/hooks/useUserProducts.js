import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userProductsMock } from '../mocks/userProductsMock';
import { toast } from "sonner";

// Simulando armazenamento local para as plataformas de venda
let exportedPlatforms = {};

export const useUserProducts = () => useQuery({
  queryKey: ['userProducts'],
  queryFn: async () => {
    // Simulando um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return userProductsMock.map(product => ({
      ...product,
      exportedPlatforms: exportedPlatforms[product.id] || []
    }));
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

export const useUpdateUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedProduct) => {
      // Simulando um delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = userProductsMock.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        userProductsMock[index] = { ...userProductsMock[index], ...updatedProduct };
      }
      return [...userProductsMock];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast.success('Produto atualizado com sucesso');
    },
    onError: (error) => {
      toast.error(`Falha ao atualizar produto: ${error.message}`);
    },
  });
};

export const useExportProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, platforms }) => {
      // Simulando um delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      exportedPlatforms[productId] = platforms;
      return { productId, exportedPlatforms: platforms };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
      toast.success('Produto exportado com sucesso');
    },
    onError: (error) => {
      toast.error(`Falha ao exportar produto: ${error.message}`);
    },
  });
};