import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { fetchProductColumns, handleSupabaseResponse } from '../utils/supabaseHelpers';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const columns = await fetchProductColumns();
      return handleSupabaseResponse(supabase
        .from('products')
        .select(columns.join(', '))
      );
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      return handleSupabaseResponse(supabase.from('products').insert([newProduct]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      return handleSupabaseResponse(supabase.from('products').update(product).eq('id', id));
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
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      return handleSupabaseResponse(supabase.from('products').delete().eq('id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};