import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const logActivity = async (userId, action, description) => {
  await supabase.from('activity_logs').insert([
    { user_id: userId, action, description }
  ]);
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      const user = supabase.auth.user();
      await logActivity(user.id, 'CREATE', `Produto "${newProduct.name}" foi criado.`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      const user = supabase.auth.user();
      await logActivity(user.id, 'UPDATE', `Produto com ID ${id} foi atualizado.`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      const user = supabase.auth.user();
      await logActivity(user.id, 'DELETE', `Produto com ID ${id} foi excluído.`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};