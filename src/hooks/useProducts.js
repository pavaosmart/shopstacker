import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const handleSupabaseResponse = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("Error in Supabase operation:", err);
    throw err;
  }
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      return handleSupabaseResponse(supabase
        .from('products')
        .select('name, product_cost, taxes, shipping, marketplace_url, product_image')
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