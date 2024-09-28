import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['products'], (oldData) => [...(oldData || []), data]);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }) => {
      const { data, error } = await supabase.from('products').update(product).eq('id', id).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products'], (oldData) => 
        oldData.map((product) => product.id === updatedProduct.id ? updatedProduct : product)
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['products'], (oldData) => 
        oldData.filter((product) => product.id !== deletedId)
      );
    },
  });
};