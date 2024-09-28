import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getAuthenticatedClient } from '../integrations/supabase/supabase';

const handleSupabaseResponse = async (promise) => {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const authenticatedClient = await getAuthenticatedClient();
      return handleSupabaseResponse(authenticatedClient
        .from('products')
        .select('id, name, product_cost, taxes, shipping, marketplace_url, product_image')
      );
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const authenticatedClient = await getAuthenticatedClient();
      return handleSupabaseResponse(authenticatedClient.from('products').insert([newProduct]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product) => {
      const authenticatedClient = await getAuthenticatedClient();
      return handleSupabaseResponse(authenticatedClient.from('products').update(product).eq('id', product.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const authenticatedClient = await getAuthenticatedClient();
      return handleSupabaseResponse(authenticatedClient.from('products').delete().eq('id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};