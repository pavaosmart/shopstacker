import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const handleSupabaseResponse = async (promise) => {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Não autenticado');
      }
      return handleSupabaseResponse(supabase
        .from('products')
        .select('id, name, product_cost, taxes, shipping, marketplace_url, product_image')
      );
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProduct) => handleSupabaseResponse(supabase.from('products').insert([newProduct])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => handleSupabaseResponse(supabase.from('products').update(product).eq('id', product.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => handleSupabaseResponse(supabase.from('products').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};