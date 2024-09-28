import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const handleSupabaseResponse = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) {
      if (error.message.includes("column")) {
        console.warn("Aviso: Coluna faltante na consulta", error);
        return [];
      }
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("Erro no Supabase:", err);
    throw err;
  }
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Não autenticado');
      }

      // Buscando colunas dinamicamente
      const { data: columns } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'products');

      const columnsList = columns.map(col => col.column_name).join(', ');

      return handleSupabaseResponse(supabase
        .from('products')
        .select(columnsList)
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
        throw new Error('Não autenticado');
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
        throw new Error('Não autenticado');
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
        throw new Error('Não autenticado');
      }
      return handleSupabaseResponse(supabase.from('products').delete().eq('id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};